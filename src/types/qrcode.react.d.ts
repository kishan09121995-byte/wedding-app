declare module 'qrcode.react' {
  import React from 'react'

  interface QRCodeProps {
    value: string
    size?: number
    bgColor?: string
    fgColor?: string
    level?: 'L' | 'M' | 'Q' | 'H'
    includeMargin?: boolean
    renderAs?: 'canvas' | 'svg'
    [key: string]: any
  }

  export default class QRCode extends React.Component<QRCodeProps> {}
}
