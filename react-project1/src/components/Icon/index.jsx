/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-07-05 10:12:42
 * @LastEditTime: 2022-07-05 10:50:04
 * @LastEditors: Author
 */
function Icon (props) {
  if (!props.icon) {
    return <span>暂无icon</span>
  }
  const img = require(`@/assets/images/icon/${props.icon}.svg`)

  console.log('img',img);
  return <>
    <img style={{width: props.width || 16 , height: props.height || 16, marginRight: '11px'}} src={img.default} alt='图片加载失败'/>
  </>
}

export default Icon