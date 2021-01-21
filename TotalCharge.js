import { useEffect, useState, useRef } from 'react'

export default function TotalCharge(props) {
  const [showinput, setshowinput] = useState(false)
  const inputElement = useRef()
  const totalData = useRef()

  const editClick = () => {
    if (showinput === true) return
    setshowinput(true)
  }

  useEffect(() => {
    showinput && inputElement.current.focus()
  })

  totalData.current = props.totalData

  const mouseLeave = () => {
    setshowinput(false)
  }

  const changeHandle = (e) => {
    //TODO 在此处修改处理修改数据，并更新到state里去
    let CV = e.target.value
    CV = Number(CV && CV.replace(/^0+/, ''))
    props.setTotalData(CV)
  }

  const renderInput = (val) => {
    val = val ?? 0
    if (showinput) {
      return (
        <input
          ref={inputElement}
          type="number"
          onBlur={mouseLeave}
          onChange={changeHandle}
          className="cvinput"
          style={{ fontWeight: 'bold', fontSize: '18px' }}
          defaultValue={val}
          maxLength="5"
        />
      )
    }
  }

  const totalDatas = totalData.current
  return (
    <tfoot>
      <tr>
        {Object.keys(totalDatas).map((key, index) => {
          if (key === 'CPA') {
            const cpa = totalDatas[key]
            const tdclass =
              cpa === 0
                ? 'normal'
                : cpa < 100
                ? 'fine'
                : cpa < 140
                ? 'general'
                : cpa < 200
                ? 'bad'
                : 'wrong'
            return (
              <td key={index} className={tdclass}>
                {cpa}
              </td>
            )
          }
          if (key === 'CV') {
            return (
              <td key={index} onClick={editClick}>
                {totalDatas[key]}
                {renderInput(totalDatas[key])}
              </td>
            )
          }
          return <td key={index}>{totalDatas[key]}</td>
        })}
      </tr>
    </tfoot>
  )
}
