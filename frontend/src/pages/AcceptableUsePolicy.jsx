import React from 'react';

const AcceptableUsePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <style jsx>{`
        [data-custom-class='body'], [data-custom-class='body'] * {
          background: transparent !important;
        }
        [data-custom-class='title'], [data-custom-class='title'] * {
          font-family: Arial !important;
          font-size: 26px !important;
          color: #000000 !important;
        }
        [data-custom-class='subtitle'], [data-custom-class='subtitle'] * {
          font-family: Arial !important;
          color: #595959 !important;
          font-size: 14px !important;
        }
        [data-custom-class='heading_1'], [data-custom-class='heading_1'] * {
          font-family: Arial !important;
          font-size: 19px !important;
          color: #000000 !important;
        }
        [data-custom-class='heading_2'], [data-custom-class='heading_2'] * {
          font-family: Arial !important;
          font-size: 17px !important;
          color: #000000 !important;
        }
        [data-custom-class='body_text'], [data-custom-class='body_text'] * {
          color: #595959 !important;
          font-size: 14px !important;
          font-family: Arial !important;
        }
        [data-custom-class='link'], [data-custom-class='link'] * {
          color: #3030F1 !important;
          font-size: 14px !important;
          font-family: Arial !important;
          word-break: break-word !important;
        }
        ul {
          list-style-type: square;
        }
        ul > li > ul {
          list-style-type: circle;
        }
        ul > li > ul > li > ul {
          list-style-type: square;
        }
        ol li {
          font-family: Arial;
        }
      `}</style>

      <span 
        className="block mx-auto mb-12 w-44 h-10 bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzgiIGhlaWdodD0iMzgiIHZpZXdCb3g9IjAgMCAxNzggMzgiPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBmaWxsPSIjRDFEMUQxIiBkPSJNNC4yODMgMjQuMTA3Yy0uNzA1IDAtMS4yNTgtLjI1Ni0xLjY2LS43NjhoLS4wODVjLjA1Ny41MDIuMDg2Ljc5Mi4wODYuODd2Mi40MzRILjk4NXYtOC42NDhoMS4zMzJsLjIzMS43NzloLjA3NmMuMzgzLS41OTQuOTUtLjg5MiAxLjcwMi0uODkyLjcxIDAgMS4yNjQuMjc0IDEuNjY1LjgyMi40MDEuNTQ4LjYwMiAxLjMwOS42MDIgMi4yODMgMCAuNjQtLjA5NCAxLjE5OC0uMjgyIDEuNjctLjE4OC40NzMtLjQ1Ni44MzMtLjgwMyAxLjA4LS4zNDcuMjQ3LS43NTYuMzctMS4yMjUuMzd6TTMuOCAxOS4xOTNjLS40MDUgMC0uNy4xMjQtLjg4Ni4zNzMtLjE4Ny4yNDktLjI4My42Ni0uMjkgMS4yMzN2LjE3N2MwIC42NDUuMDk1IDEuMTA3LjI4NyAxLjM4Ni4xOTIuMjguNDk1LjQxOS45MS40MTkuNzM0IDAgMS4xMDEtLjYwNSAxLjEwMS0xLjgxNiAwLS41OS0uMDktMS4wMzQtLjI3LTEuMzI5LS4xODItLjI5NS0uNDY1LS40NDMtLjg1Mi0uNDQzem01LjU3IDEuNzk0YzAgLjU5NC4wOTggMS4wNDQuMjkzIDEuMzQ4LjE5Ni4zMDQuNTEzLjQ1Ny45NTQuNDU3LjQzNyAwIC43NS0uMTUyLjk0Mi0uNDU0LjE5Mi0uMzAzLjI4OC0uNzUzLjI4OC0xLjM1MSAwLS41OTUtLjA5Ny0xLjA0LS4yOS0xLjMzOC0uMTk0LS4yOTctLjUxLS40NDUtLjk1LS40NDUtLjQzOCAwLS43NTMuMTQ3LS45NDYuNDQzLS4xOTQuMjk1LS4yOS43NDItLjI5IDEuMzR6bTQuMTUzIDBjMCAuOTc3LS4yNTggMS43NDItLjc3NCAyLjI5My0uNTE1LjU1Mi0xLjIzMy44MjctMi4xNTQuODI3LS41NzYgMC0xLjA4NS0uMTI2LTEuNTI1LS4zNzhhMi41MiAyLjUyIDAgMCAxLTEuMDE1LTEuMDg4Yy0uMjM3LS40NzMtLjM1NS0xLjAyNC0uMzU1LTEuNjU0IDAtLjk4MS4yNTYtMS43NDQuNzY4LTIuMjg4LjUxMi0uNTQ1IDEuMjMyLS44MTcgMi4xNi0uODE3LjU3NiAwIDEuMDg1LjEyNiAxLjUyNS4zNzYuNDQuMjUxLjc3OS42MSAxLjAxNSAxLjA4LjIzNi40NjkuMzU1IDEuMDE5LjM1NSAxLjY0OXpNMTkuNzEgMjRsLS40NjItMi4xLS42MjMtMi42NTNoLS4wMzdMMTcuNDkzIDI0SDE1LjczbC0xLjcwOC02LjAwNWgxLjYzM2wuNjkzIDIuNjU5Yy4xMS40NzYuMjI0IDEuMTMzLjMzOCAxLjk3MWguMDMyYy4wMTUtLjI3Mi4wNzctLjcwNC4xODgtMS4yOTRsLjA4Ni0uNDU3Ljc0Mi0yLjg3OWgxLjgwNGwuNzA0IDIuODc5Yy4wMTQuMDc5LjAzNy4xOTUuMDY3LjM1YTIwLjk5OCAyMC45OTggMCAwIDEgLjE2NyAxLjAwMmMuMDIzLjE2NS4wMzYuMjk5LjA0LjM5OWguMDMyYy4wMzItLjI1OC4wOS0uNjExLjE3Mi0xLjA2LjA4Mi0uNDUuMTQxLS43NTQuMTc3LS45MTFsLjcyLTIuNjU5aDEuNjA2TDIxLjQ5NCAyNGgtMS43ODN6bTcuMDg2LTQuOTUyYy0uMzQ4IDAtLjYyLjExLS44MTcuMzMtLjE5Ny4yMi0uMzEuNTMzLS4zMzguOTM3aDIuMjk5Yy0uMDA4LS40MDQtLjExMy0uNzE3LS4zMTctLjkzNy0uMjA0LS4yMi0uNDgtLjMzLS44MjctLjMzem0uMjMgNS4wNmMtLjk2NiAwLTEuNzIyLS4yNjctMi4yNjYtLjgtLjU0NC0uNTM0LS44MTYtMS4yOS0uODE2LTIuMjY3IDAtMS4wMDcuMjUxLTMS43ODUuNzU0LTIuMzM0LjUwMy0uNTUgMS4xOTktLjgyNSAyLjA4Ny0uODI1Ljg0OCAwIDEuNTEuMjQyIDEuOTgyLjcyNS40NzIuNDg0LjcwOSAxLjE1Mi43MDkgMi4wMDR2Ljc5NWgtMy44NzNjLjAxOC40NjUuMTU2LjgyOS40MTQgMS4wOS4yNTguMjYxLjYyLjM5MiAxLjA4NS4zOTIuMzYxIDAgLjcwMy0uMDM3IDEuMDI2LS4xMTNhNS4xMzMgNS4xMzMgMCAwIDAgMS4wMS0uMzZ2MS4yNjhjLS4yODcuMTQzLS41OTMuMjUtLjkyLjMyYTUuNzkgNS43OSAwIDAgMS0xLjE5MS4xMDR6bTcuMjUzLTYuMjI2Yy4yMjIgMCAuNDA2LjAxNi41NTMuMDQ5bC0uMTI0IDEuNTM2YTEuODc3IDEuODc3IDAgMCAwLS40ODMtLjA1NGMtLjUyMyAwLS45My4xMzQtMS4yMjIuNDAzLS4yOTIuMjY4LS40MzguNjQ0LS40MzggMS4xMjhWMjRoLTEuNjM4di02LjAwNWgxLjI0bC4yNDIgMS4wMWguMDhjLjE4Ny0uMzM3LjQzOS0uNjA4Ljc1Ni0uODE0YTEuODYgMS44NiAwIDAgMSAxLjAzNC0uMzA5em00LjAyOSAxLjE2NmMtLjM0NyAwLS42Mi4xMS0uODE3LjMzLS4xOTcuMjItLjMxLjUzMy0uMzM4LjkzN2gyLjI5OWMtLjAwNy0uNDA0LS4xMTMtLjcxNy0uMzE3LS45MzctLjIwNC0uMjItLjQ4LS4zMy0uODI3LS4zM3ptLjIzIDUuMDZjLS45NjYgMC0xLjcyMi0uMjY3LTIuMjY2LS44LS41NDQtLjUzNC0uODE2LTEuMjktLjgxNi0yLjI2NyAwLTEuMDA3LjI1MS0xLjc4NS43NTQtMi4zMzQuNTA0LS41NSAxLjItLjgyNSAyLjA4Ny0uODI1Ljg0OSAwIDEuNTEuMjQyIDEuOTgyLjcyNS40NzMuNDg0LjcwOSAxLjE1Mi43MDkgMi4wMDR2Ljc5NWgtMy44NzNjLjAxOC40NjUuMTU2LjgyOS40MTQgMS4wOS4yNTguMjYxLjYyLjM5MiAxLjA4NS4zOTIuMzYyIDAgLjcwNC0uMDM3IDEuMDI2LS4xMTNhNS4xMzMgNS4xMzMgMCAwIDAgMS4wMS0uMzZ2MS4yNjhjLS4yODcuMTQzLS41OTMuMjUtLjkxOS4zMmE1Ljc5IDUuNzkgMCAwIDEtMS4xOTIuMTA0em01LjgwMyAwYy0uNzA2IDAtMS4yNi0uMjc1LTEuNjYzLS44MjItLjQwMy0uNTQ4LS42MDQtMS4zMDctLjYwNC0yLjI3OCAwLS45ODQuMjA1LTEuNzUyLjYxNS0yLjMwMS40MS0uNTUuOTc1LS44MjUgMS42OTUtLjgyNS43NTUgMCAxLjMzMi4yOTQgMS43MjkuODgxaC4wNTRhNi42OTcgNi42OTcgMCAwIDEtLjEyNC0xLjE5OHYtMS45MjJoMS42NDRWMJRING0uNDNsLS4zMTctLjc3OWgtLjA3Yy0uMzcyLjU5MS0uOTQuODg2LTEuNzAyLjg4NnptLjU3NC0xLjMwNmMuNDIgMCAuNzI2LS4xMjEuOTIxLS4zNjUuMTk2LS4yNDMuMzAyLS42NTcuMzItMS4yNHYtLjE3OGMwLS42NDQtLjEtMS4xMDYtLjI5OC0xLjM4Ni0uMTk5LS4yNzktLjUyMi0uNDE5LS45Ny0uNDE5YS45NjIuOTYyIDAgMCAwLS44NS40NjVjLS4yMDMuMzEtLjMwNC43Ni0uMzA0IDEuMzUgMCAuNTkyLjEwMiAxLjAzNS4zMDYgMS4zMy4yMDQuMjk2LjQ5Ni40NDMuODc1LjQ0M3ptMTAuOTIyLTQuOTJjLjcwOSAwIDEuMjY0LjI3NyAxLjY2NS44My40LjU1My42MDEgMS4zMTIuNjAxIDIuMjc1IDAgLjk5Mi0uMjA2IDEuNzYtLjYyIDIuMzA0LS40MTQuNTQ0LS45NzcuODE2LTEuNjkuODE2LS43MDUgMC0xLjI1OC0uMjU2LTEuNjU5LS43NjhoLS4xMTNsLS4yNzQuNjYxaC0xLjI1MXYtOC4zNTdoMS42Mzh2MS45NDRjMCAuMjQ3LS4wMjEuNjQzLS4wNjQgMS4xODdoLjA2NGMuMzgzLS41OTQuOTUtLjg5MiAxLjcwMy0uODkyek01Ni40IDIxLjI5M2MtLjQwNCAwLS43LjEyNS0uODg2LjM3NC0uMTg2LjI0OS0uMjgzLjY2LS4yOSAxLjIzM3YuMTc3YzAgLjY0NS4wOTYgMS4xMDcuMjg3IDEuMzg2LjE5Mi4yOC40OTUuNDE5LjkxLjQxOS4zMzcgMCAuNjA1LS4xNTUuODA0LS40NjUuMTk5LS4zMS4yOTgtLjc2LjI5OC0xLjM1IDAtLjU5MS0uMS0xLjAzNS0uMy0xLjMzYS45NDMuOTQzIDAgMCAwLS44MjMtLjQ0M3ptMy4xODYtMS4xOTdoMS43OTRsMS4xMzQgMy4zNzljLjA5Ni4yOTMuMTYzLjY0LjE5OCAxLjA0MmguMDMzYy4wMzktLjM3LjExNi0uNzE3LjIzLTEuMDQybDEuMTEyLTMuMzc5aDEuNzU3bC0yLjU0IDYuNzczYy0uMjM0LjYyNy0uNTY2IDEuMDk2LS45OTcgMS40MDctLjQzMi4zMTItLjkzNi40NjgtMS41MTIuNDY4LS4yODMgMC0uNTYtLjAzLS44MzMtLjA5MnYtMS4zYTIuOCAyLjggMCAwIDAgLjY0NS4wN2MuMjkgMCAuNTQzLS4wODguNzYtLjI2Ni4yMTctLjE3Ny4zODYtLjQ0NC41MDgtLjgwM2wuMDk2LS4yOTUtMi4zODUtNS45NjJ6Ii8+CiAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzMpIj4KICAgICAgICAgICAgPGNpcmNsZSBjeD0iMTkiIGN5PSIxOSIgcj0iMTkiIGZpbGw9IiNFMEUwRTAiLz4KICAgICAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTIyLjQ3NCAxNS40NDNoNS4xNjJMMTIuNDM2IDMwLjRWMTAuMzYzaDE1LjJsLTUuMTYyIDUuMDh6Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxwYXRoIGZpbGw9IiNEMkQyRDIiIGQ9Ik0xMjEuNTQ0IDE0LjU2di0xLjcyOGg4LjI3MnYxLjcyOGgtMy4wMjRWMjRoLTIuMjR2LTkuNDRoLTMuMDA4em0xMy43NDQgOS41NjhjLTEuMjkgMC0yLjM0MS0uNDE5LTMuMTUyLTEuMjU2LS44MS0uODM3LTEuMjE2LTEuOTQ0LTEuMjE2LTMuMzJzLjQwOC0yLjQ3NyAxLjIyNC0zLjMwNGMuODE2LS44MjcgMS44NzItMS4yNCAzLjE2OC0xLjI0czIuMzYuNDAzIDMuMTkyIDEuMjA4Yy44MzIuODA1IDEuMjQ4IDEuODggMS4yNDggMy4yMjQgMCAuMzEtLjAyMS41OTctLjA2NC44NjRoLTYuNDY0Yy4wNTMuNTc2LjI2NyAxLjA0LjY0IDEuMzkyLjM3My4zNTIuODQ4LjUyOCAxLjQyNC41MjguNzc5IDAgMS4zNTUtLjMyIDEuNzI4LS45NmgyLjQzMmEzLjg5MSAzLjg5MSAwIDAgMS0xLjQ4OCAyLjA2NGMtLjczNi41MzMtMS42MjcuOC0yLjY3Mi44em0xLjQ4LTYuNjg4Yy0uNC0uMzUyLS44ODMtLjUyOC0xLjQ0OC0uNTI4cy0xLjAzNy4xNzYtMS40MTYuNTI4Yy0uMzc5LjM1Mi0uNjA1LjgyMS0uNjggMS40MDhoNC4xOTJjLS4wMzItLjU4Ny0uMjQ4LTMS4wNTYtLjY0OC0xLjQwOHptNy4wMTYtMi4zMDR2MS41NjhjLjU5Ny0xLjEzIDEuNDYxLTEuNjk2IDIuNTkyLTEuNjk2djIuMzA0aC0uNTZjLS42NzIgMC0xLjE3OS4xNjgtMS41Mi41MDQtLjM0MS4zMzYtLjUxMi45MTUtLjUxMiAxLjczNlYyNGgtMi4yNTZ2LTguODY0aDIuMjU2em02LjQ0OCAwdjEuMzI4Yy41NjUtLjk3IDEuNDgzLTEuNDU2IDIuNzUyLTEuNDU2LjY3MiAwIDEuMjcyLjE1NSAxLjguNDY0LjUyOC4zMS45MzYuNzUyIDEuMjI0IDEuMzI4LjMxLS41NTUuNzMzLS45OTIgMS4yNzItMS4zMTJhMy40ODggMy40ODggMCAwIDEgMS44MTYtLjQ4YzEuMDU2IDAgMS45MDcuMzMgMi41NTIuOTkyLjY0NS42NjEuOTY4IDEuNTkuOTY4IDIuNzg0VjI0aC0yLjI0di00Ljg5NmMwLS42OTMtLjE3Ni0xLjIyNC0uNTI4LTEuNTkyLS4zNTItLjM2OC0uODMyLS41NTItMS40NC0uNTUycy0xLjA5LjE4NC0xLjQ0OC41NTJjLS4zNTcuMzY4LS41MzYuODk5LS41MzYgMS41OTJWMJRING0tMi4yNHYtNC44OTZjMC0uNjkzLS4xNzYtMS4yMjQtLjUyOC0xLjU5Mi0uMzUyLS4zNjgtLjgzMi0uNTUyLTEuNDQtLjU1MnMtMS4wOS4xODQtMS40NDguNTUyYy0uMzU3LjM2OC0uNTM2Ljg5OS0uNTM2IDEuNTkyVjI0aC0yLjI1NnYtOC44NjRoMi4yNTZ6TTE2NC45MzYgMjRWMTIuMTZoMi4yNTZWMjRoLTIuMjU2em03LjA0LS4xNmwtMy40NzItOC43MDRoMi41MjhsMi4yNTYgNi4zMDQgMi4zODQtNi4zMDRoMi4zNTJsLTUuNTM2IDEzLjA1NmgtMi4zNTJsMS44NC00LjM1MnoiLz4KICAgIDwvZz4KPC9zdmc+K)`
        }}
      />

      <div data-custom-class="body">
        <div data-custom-class="title" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '26px' }}>
              <h1>ACCEPTABLE USE POLICY</h1>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="subtitle" style={{ lineHeight: '1.5' }}>
          <strong>Last updated</strong> <strong>August 02, 2025</strong>
        </div>
        
        <div style={{ lineHeight: '1.2' }}><br /></div>
        <div style={{ lineHeight: '1.5' }}><br /></div>
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          This Acceptable Use Policy ("Policy") is part of our __________ ("Legal Terms") and should therefore be read alongside our main Legal Terms: <span style={{ color: 'rgb(0, 58, 250)' }}>__________</span>. When you use the AI-powered services provided by Articles Team ("AI Products"), you warrant that you will comply with this document, our Legal Terms and all applicable laws and regulations governing AI. Your usage of our AI Products signifies your agreement to engage with our platform in a lawful, ethical, and responsible manner that respects the rights and dignity of all individuals. If you do not agree with these Legal Terms, please refrain from using our Services. Your continued use of our Services implies acceptance of these Legal Terms.
        </div>
        
        <div style={{ lineHeight: '1' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          Please carefully review this Policy which applies to any and all:
        </div>
        
        <div style={{ lineHeight: '1' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5', marginLeft: '20px' }}>
          (a) uses of our Services (as defined in "Legal Terms")
        </div>
        <div data-custom-class="body_text" style={{ lineHeight: '1.5', marginLeft: '20px' }}>
          (b) forms, materials, consent tools, comments, post, and all other content available on the Services ("Content")
        </div>
        <div data-custom-class="body_text" style={{ lineHeight: '1.5', marginLeft: '20px' }}>
          (c) material which you contribute to the Services including any upload, post, review, disclosure, ratings, comments, chat etc. in any forum, chatrooms, reviews, and to any interactive services associated with it ("Contribution")
        </div>
        <div data-custom-class="body_text" style={{ lineHeight: '1.5', marginLeft: '20px' }}>
          (d) responsible implementation and management of AI Products within our Services
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="heading_1" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '19px' }}>
              <h2>WHO WE ARE</h2>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          We are Articles Team ("Company," "we," "us," or "our") a company registered in Vietnam at 828 Sư Vạn Hạnh, Phường Hòa Hưng, Hồ Chí Minh, Quận 10 700000. We operate the mobile application Articles (the "App"), as well as any other related products and services that refer or link to this Policy (collectively, the "Services").
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="heading_1" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '19px' }}>
              <h2>USE OF THE SERVICES</h2>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          When you use the Services, you warrant that you will comply with this Policy and with all applicable laws.
        </div>
        
        <div style={{ lineHeight: '1' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          You also acknowledge that you may not:
        </div>
        
        <ul>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Engage in unauthorized framing of or linking to the Services.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Make improper use of our Services, including our support services or submit false reports of abuse or misconduct.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Engage in any automated use of the Services, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Interfere with, disrupt, or create an undue burden on the Services or the networks or the Services connected.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Attempt to impersonate another user or person or use the username of another user.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Use any information obtained from the Services in order to harass, abuse, or harm another person.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services, except as expressly permitted by applicable law.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Delete the copyright or other proprietary rights notice from any Content.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ("gifs"), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as "spyware" or "passive collection mechanisms" or "pcms").
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or using or launching any unauthorized script or other software.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Use the Services in a manner inconsistent with any applicable laws or regulations.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Use to post the articles and manage them.
          </li>
        </ul>
        
        <div style={{ lineHeight: '1.5' }}></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          <strong>AI Products</strong>
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          When you use the AI Products provided by Articles Team, you warrant that you will not:
        </div>
        
        <ul>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Deploy AI techniques that utilize subliminal, manipulative, or deceptive methods designed to distort behavior and impair informed decision-making, particularly when such actions cause significant harm to individuals.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Exploit vulnerabilities related to age, disability, or socio-economic circumstances through AI in a way that distorts behavior or decision-making, especially if this results in significant harm to the individual.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Use AI systems for biometric categorization that infer sensitive attributes such as race, political opinions, trade union membership, religious or philosophical beliefs, sex life, or sexual orientation, except in limited cases, such as labeling or filtering lawfully acquired datasets, or specific law enforcement activities.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Implement AI-based social scoring systems that evaluate or classify individuals or groups based on their social behavior or personal traits in a manner that causes harm, discrimination, or unfair treatment.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Assess the risk of an individual committing criminal offenses based solely on profiling, personality traits, or other non-behavioral factors, except in narrowly defined circumstances where legal safeguards are in place.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Not compile facial recognition databases through untargeted scraping of facial images from the internet, social media, or CCTV footage, unless it is part of a legally compliant and narrowly defined purpose.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Use AI to infer emotions in sensitive environments such as workplaces, educational institutions, or any other context where such analysis could lead to discrimination, unfair treatment, or privacy violations.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Engage in real-time remote biometric identification in public places for law enforcement purposes, except in specific situations where there are strong legal justifications and oversight mechanisms.
          </li>
        </ul>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="heading_1" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '19px' }}>
              <h2>ARTIFICIAL INTELLIGENCE</h2>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          We recognize the significant impact AI can have on our users and society, and we are dedicated to ensuring that our AI Products are designed and operated in a manner that aligns with comprehensive ethical standards. We aim to use AI to enhance user experiences while upholding fairness, transparency, and accountability principles.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          This Policy applies to all AI-powered features, services, and systems in our Services. It governs the development, deployment, and use of AI technologies to protect users' rights and maintain transparency in all AI operations. This Policy applies to all stakeholders, including employees, third-party vendors, and partners who contribute to or interact with our AI Products.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          <strong>Enforcement</strong>
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          Any misuse of our AI Products or failure to adhere to the standards outlined in this Policy will result in appropriate actions to ensure the integrity of our platform and the protection of our users. The specific consequences for misuse of AI may vary depending on the nature and severity of the violation and the user's history with our Services.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          Violations may include, but are not limited to:
        </div>
        
        <ul>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Engaging the AI Products in ways that violate user privacy, manipulate data, disregard ethical guidelines, or are against AI Service Providers' terms of use.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Deploying AI in a manner that introduces or causes bias, leading to unfair treatment of users or groups.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Improper handling, storage, or use of data by AI Products, leading to breaches of user trust and legal compliance.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            Using AI in a way that compromises the privacy and security of our systems, data, or users.
          </li>
        </ul>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          Depending on the violation, Articles Team may take one or more of the following actions:
        </div>
        
        <ul>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            <strong>Warnings:</strong> The responsible party may receive a formal warning and be required to cease violating practices.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            <strong>Temporary Suspension:</strong> In cases of repeated or more severe violations, the responsible individual's access to AI Products or certain features of our platform may be temporarily suspended while the issue is investigated.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            <strong>Termination of Access:</strong> Serious violations, particularly those that result in harm to users or breach privacy or other regulations, may lead to the permanent termination of access to our AI Products and Services.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            <strong>Legal Action:</strong> In cases where the misuse of AI leads to significant harm, data breaches, or legal violations, we may pursue legal action against the party responsible. This could include reporting the incident to law enforcement or regulatory bodies.
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            <strong>Public Disclosure:</strong> For incidents that impact public trust or involve severe ethical breaches, we reserve the right to publicly disclose the violation and the actions taken in response to maintain transparency and accountability.
          </li>
        </ul>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          <strong>Commitment to Responsible AI</strong>
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          In addition to the consequences outlined above, we are deeply committed to repairing any harm caused by the misuse of AI. This commitment is a testament to our dedication to our users and our responsibility as a company. We will correct biased outcomes and implement additional safeguards to prevent future violations.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          At Articles Team, we are committed to the ongoing refinement and enhancement of our Policy. As technology evolves and regulatory environments shift, we recognize the importance of keeping our policies up to date to ensure that they remain relevant, effective, and aligned with best practices in AI ethics. We will regularly review and update our Policy to reflect technological advancements and legal changes in local, national, and international regulations related to AI. Our Policy will be updated as needed to comply with new laws and guidelines, ensuring that our practices remain legally sound and socially responsible.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="heading_1" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '19px' }}>
              <h2>CONTRIBUTIONS</h2>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          In this Policy, the term "Contributions" means:
        </div>
        
        <ul>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            any data, information, software, text, code, music, scripts, sound, graphics, photos, videos, tags, messages, interactive features, or other materials that you post, share, upload, submit, or otherwise provide in any manner on or through to the Services; or
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            any other content, materials, or data you provide to Articles Team or use with the Services.
          </li>
        </ul>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          Some areas of the Services may allow users to upload, transmit, or post Contributions. We may but are under no obligation to review or moderate the Contributions made on the Services, and we expressly exclude our liability for any loss or damage resulting from any of our users' breach of this Policy. Please report any Contribution that you believe breaches this Policy; however, we will determine, in our sole discretion, whether a Contribution is indeed in breach of this Policy.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          You warrant that:
        </div>
        
        <ul>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            you are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and this Policy;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            all your Contributions comply with applicable laws and are original and true (if they represent your opinion or facts);
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            the creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party; and
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            you have the verifiable consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and this Policy.
          </li>
        </ul>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          You also agree that you will not post, transmit, or upload any (or any part of a) Contribution that:
        </div>
        
        <ul>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            is in breach of applicable laws, regulation, court order, contractual obligation, this Policy, our Legal Terms, a legal duty, or that promotes or facilitates fraud or illegal activities;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            is defamatory, obscene, offensive, hateful, insulting, intimidating, bullying, abusive, or threatening, to any person or group;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            is false, inaccurate, or misleading;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            includes child sexual abuse material, or violates any applicable law concerning child pornography or otherwise intended to protect minors;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            contains any material that solicits personal information from anyone under the age of 18 or exploits people under the age of 18 in a sexual or violent manner;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            promotes violence, advocates the violent overthrow of any government, or incites, encourages, or threatens physical harm against another;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            is obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, contains sexually explicit material, or is otherwise objectionable (as determined by us);
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            is discriminatory based on race, sex, religion, nationality, disability, sexual orientation, or age;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            bullies, intimidates, humiliates, or insults any person;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            promotes, facilitates, or assists anyone in promoting and facilitating acts of terrorism;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            infringes, or assists anyone in infringing, a third party's intellectual property rights or publicity or privacy rights;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            is deceitful, misrepresents your identity or affiliation with any person and/or misleads anyone as to your relationship with us or implies that the Contribution was made by someone else than you;
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            contains unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation that has been "paid for," whether with monetary compensation or in kind; or
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            misrepresents your identity or who the Contribution is from.
          </li>
        </ul>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="heading_1" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '19px' }}>
              <h2>REPORTING A BREACH OF THIS POLICY</h2>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          We may but are under no obligation to review or moderate the Contributions made on the Services and we expressly exclude our liability for any loss or damage resulting from any of our users' breach of this Policy.
        </div>
        
        <div style={{ lineHeight: '1' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          If you consider that any Service, Content, or Contribution:
        </div>
        
        <ul>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            breach this Policy, please email us at admin@articles.com, or refer to the contact details at the bottom of this document to let us know which Service, Content, or Contribution is in breach of this Policy and why
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            infringe any third-party intellectual property rights, please email us at admin@articles.com
          </li>
          <li data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
            users can also send detailed feedback on their interactions with our AI Products by emailing admin@articles.com, or referring to the contact details at the bottom of this document. You should include specific details about the AI interaction, such as the context, the nature of the concern, and any relevant screenshots or documentation
          </li>
        </ul>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          We will reasonably determine whether a Service, Content, or Contribution breaches this Policy.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="heading_1" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '19px' }}>
              <h2>CONSEQUENCES OF BREACHING THIS POLICY</h2>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          The consequences for violating our Policy will vary depending on the severity of the breach and the user's history on the Services, by way of example:
        </div>
        
        <div style={{ lineHeight: '1' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          We may, in some cases, give you a warning and/or remove the infringing Contribution, however, if your breach is serious or if you continue to breach our Legal Terms and this Policy, we have the right to suspend or terminate your access to and use of our Services and, if applicable, disable your account. We may also notify law enforcement or issue legal proceedings against you when we believe that there is a genuine risk to an individual or a threat to public safety.
        </div>
        
        <div style={{ lineHeight: '1' }}><br /></div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          We exclude our liability for all action we may take in response to any of your breaches of this Policy.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="heading_1" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '19px' }}>
              <h2>COMPLAINTS AND REMOVAL OF LEGITIMATE CONTENT</h2>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          If you consider that some Content or Contribution have been mistakenly removed or blocked from the Services, please refer to the contact details at the bottom of this document and we will promptly review our decision to remove such Content or Contribution. The Content or Contribution may stay "down" whilst we conduct the review process.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="heading_1" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '19px' }}>
              <h2>DISCLAIMER</h2>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          Articles Team is under no obligation to monitor users' activities, and we disclaim any responsibility for any user's misuse of the Services. Articles Team has no responsibility for any user or other Content or Contribution created, maintained, stored, transmitted, or accessible on or through the Services, and is not obligated to monitor or exercise any editorial control over such material. If Articles Team becomes aware that any such Content or Contribution violates this Policy, Articles Team may, in addition to removing such Content or Contribution and blocking your account, report such breach to the police or appropriate regulatory authority. Unless otherwise stated in this Policy, Articles Team disclaims any obligation to any person who has not entered into an agreement with Articles Team for the use of the Services.
        </div>
        
        <div style={{ lineHeight: '1.5' }}><br /></div>
        
        <div data-custom-class="heading_1" style={{ lineHeight: '1.5' }}>
          <strong>
            <span style={{ fontSize: '19px' }}>
              <h2>HOW CAN YOU CONTACT US ABOUT THIS POLICY?</h2>
            </span>
          </strong>
        </div>
        
        <div data-custom-class="body_text" style={{ lineHeight: '1.5' }}>
          If you have any further questions or comments or wish to report any problematic Content or Contribution, you may contact us by:
        </div>
        
        <div style={{ lineHeight: '1' }}><br /></div>
        
        <div style={{ lineHeight: '1.5' }}>
          <span data-custom-class="body_text">
            Email: admin@articles.com
          </span>
        </div>
      </div>
    </div>
  );
};

export default AcceptableUsePolicy;