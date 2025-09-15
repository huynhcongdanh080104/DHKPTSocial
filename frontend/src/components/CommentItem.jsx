import React, { useState } from 'react'
import { Text } from '@chakra-ui/react';
const CommentItem = (props) => {
    const [isHideComment, setIsHideComment] = useState(false);
  return (
    <div className='w-full'>
        {props.comment.commentStatus === 'hidden' ? (
            <Text color={'red'} bg={'white'} h="50%" w="100%" fontSize={['8px', 'sm', 'md', 'md']} borderRadius={'10px'} p={'2'}>
            Bình luận không phù hợp
            </Text>
        ):(
            <Text className='hover:cursor-pointer' h="50%" w="100%" fontSize={['10px', 'sm', 'md', 'md']} onClick={() => setIsHideComment(!isHideComment)}>
            {props.comment.commentDetail.length >= 50 && !isHideComment ? (
                props.comment.commentDetail.slice(0, 50) + '...'
            ):(
                props.comment.commentDetail
            )}
            </Text>
        )}
    </div>
  )
}

export default CommentItem