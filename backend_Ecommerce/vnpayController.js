import querystring from 'qs'
import crypto from 'crypto'
import moment from 'moment'
import express from 'express';
const router = express.Router();
const vnp_HashSecret = '03JI64OXU0NJ0J9L1FU5OIA063SZV6DJ'; // Khóa bí mật do VNPay cung cấp

router.post('/payment', async (req, res) => {
    const { amount, orderId, returnURL } = req.body;
    const vnp_TmnCode = 'DS93FZ5U'; // Mã TMN Code do VNPay cung cấp
    const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // URL của VNPay (sử dụng sandbox cho môi trường test)
    const vnp_ReturnUrl = `${returnURL}/e-commerce/customer/return-payment`; // URL để VNPay trả kết quả về
  
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = `Thanh toan cho don hang ${orderId}`;
    vnp_Params['vnp_OrderType'] = 'billpayment';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = req.ip;
    vnp_Params['vnp_CreateDate'] = moment().format('YYYYMMDDHHmmss');
  
    // Sắp xếp các tham số và tạo chữ ký
    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });    
    let hmac = crypto.createHmac("sha512", vnp_HashSecret);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
  
    const paymentUrl = `${vnp_Url}?${querystring.stringify(vnp_Params, { encode: false })}`;
    return res.status(200).json({ paymentUrl });
});
router.get('/returnpayment', async (req, res) => {
    const vnp_Params = req.query;

  // Extract the secure hash
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // Sort the remaining parameters
  const sortedParams = sortObject(vnp_Params);

  // Create a secure hash from the sorted parameters using vnp_HashSecret
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signedHash = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
    
    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
    
    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if(secureHash === signedHash){ //kiểm tra checksum
        const responseCode = vnp_Params['vnp_ResponseCode'];
        const amount = vnp_Params['vnp_Amount'];
        const orderId = vnp_Params['vnp_TxnRef'];
        if(checkOrderId){
            if(checkAmount){
                if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                    if(responseCode =="00"){
                        //thanh cong
                        paymentStatus = '1'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                        return res.status(200).json({
                            status: "success",
                            message: "Thanh toán thành công",
                            orderId,
                            amount,
                        });
                    }
                    else {
                        //that bai
                        paymentStatus = '2'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                        return res.status(200).json({
                            status: "failed",
                            message: "Thanh toán thất bại",
                            orderId,
                            amount,
                            responseCode,
                        });
                    }
                }
                else{
                    res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
                }
            }
            else{
                res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
            }
        }       
        else {
            res.status(200).json({RspCode: '01', Message: 'Order not found'})
        }
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
    }
  });
  function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
};
export default router;