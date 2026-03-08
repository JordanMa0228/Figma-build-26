import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import { Providers } from './app/providers'
import { getIconfontScriptUrl } from './lib/iconfont'
import './lib/i18n'
import './index.css'

// 从 iconfont.cn（扑克）加载 Symbol 图标脚本
const iconfontUrl = getIconfontScriptUrl()
if (iconfontUrl) {
  const script = document.createElement('script')
  script.src = iconfontUrl.startsWith('//') ? `https:${iconfontUrl}` : iconfontUrl
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
)

