/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 17:37:33
 * @LastEditTime: 2022-06-23 16:43:51
 * @LastEditors: Author
 */
import './index.scss'
function CustomBreadcrumb ({children, title = '首页'}) {
  return (
    <div className="custom-breadcrumb-container">
      {children || title}
    </div>
  )
}

export default CustomBreadcrumb