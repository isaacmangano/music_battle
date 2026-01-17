import React from 'react'
import './globals.css'

export const Layout = ({children}:{children: any}) => {
  return (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="./globals.css" />
      <title>Sign In | Music Note Battle</title>
    </head>
  
    <body>
{children}
    </body>
    </html>
  )
}

export default Layout;
