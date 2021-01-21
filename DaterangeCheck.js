import { useState } from 'react'

import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { DateRange } from 'react-date-range'
import { zhCN } from 'react-date-range/dist/locale'

export default function DateRangeCheck(props) {
  const { initialDate } = props
  initialDate.endDate || (initialDate.endDate = initialDate.startDate)
  const [dateRange, setdateRange] = useState([initialDate])

  const DateChangeEvent = (selection) => {
    setdateRange([selection])
    props.getDateRange(selection)
  }

  return (
    <DateRange
      editableDateInputs={true}
      onChange={(item) => DateChangeEvent(item.selection)}
      moveRangeOnFirstSelection={false}
      ranges={dateRange}
      locale={zhCN}
      dateDisplayFormat={'yyyy-MM-dd'}
      showDateDisplay={false}
    />
  )
}
