import React, { Component, Fragment } from 'react'
import Campaign from './Campaign.js'
import DateRangeCheck from './DaterangeCheck.js'
import CampaignForm from './CampaignForm'
import TotalCharge from './TotalCharge.js'
import Axios from 'axios'
import moment from 'moment'

class ChargeTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menus: ['活动', '台币', '人民币', '加粉', '成本', '备注'],
      sourceData: {
        popin: [
          {
            name: 1007,
            TWD: 450000,
            CNY: 10000,
            CV: 0,
            CPA: 0,
            PS: 'self_white1',
          },
          {
            name: 904,
            TWD: 90000,
            CNY: 20000,
            CV: 0,
            CPA: 0,
            PS: 'self_white1',
          },
          {
            name: 914,
            TWD: 45900,
            CNY: 1020,
            CV: 0,
            CPA: 0,
            PS: 'self_white1',
          },
        ],
        line: [
          {
            name: 'main',
            TWD: 180000,
            CNY: 65014,
            CV: 0,
            CPA: 0,
            PS: '祛斑line',
          },
        ],
      },
      checkData: [],
      dataUnit: {
        name: null,
        TWD: 'NT$',
        CNY: '￥',
        CV: '个',
        CPA: '￥',
        PS: null,
      },
      dateRange: {
        startDate: new Date(),
        endDate: null,
        key: 'selection',
      },
      showDateEdit: false,
      datepopup: {
        left: 0,
        top: 0,
      },
      showinput: false,
      totalData: null,
      dateInputStyle: {
        borderColor: 'rgb(61, 145, 255)',
      },
    }
    this.checkHandle = this.checkHandle.bind(this)
    this.setCV = this.setCV.bind(this)
    this.totalData = this.totalData.bind(this)
    this.getDateRange = this.getDateRange.bind(this)
    this.showCheckDate = this.showCheckDate.bind(this)
    this.hideCheckDate = this.hideCheckDate.bind(this)
    this.getSeverData = this.getSeverData.bind(this)
    this.setTotalData = this.setTotalData.bind(this)
  }

  //child handle
  checkHandle(paas, index, push) {
    let { sourceData, checkData } = this.state
    const item = sourceData[paas][index]
    if (push) {
      checkData.push(item)
    } else {
      checkData.forEach((it, i) => {
        if (it === item) {
          checkData.splice(i, 1)
        }
      })
    }
    this.setState({ checkData })
  }

  setCV(cv, paas, index) {
    const sourceData = this.state.sourceData
    sourceData[paas][index].CV = Number(cv)
    sourceData[paas][index].CPA = Number(cv)
      ? (sourceData[paas][index].CNY / sourceData[paas][index].CV).toFixed(2)
      : 0
    const totalData = this.totalData()
    this.setState({ sourceData, totalData })
  }

  //end child handle

  campaignList() {
    const { sourceData } = this.state
    let totalarr = []
    Object.values(sourceData).forEach(
      (item) => (totalarr = totalarr.concat(item)),
    )

    if (totalarr.length === 0) {
      const len = this.state.menus.length
      return (
        <tr>
          <td colSpan={len}>无数据</td>
        </tr>
      )
    }

    const unit = this.state.dataUnit

    return Object.keys(sourceData).map((paas) => {
      return sourceData[paas].map((item, index) => {
        return (
          <Campaign
            key={index}
            content={item}
            index={index}
            paas={paas}
            checkHandle={this.checkHandle}
            setCV={this.setCV}
            dataUnit={unit}
          />
        )
      })
    })
  }

  renderThead() {
    return (
      <thead>
        <tr>
          {this.state.menus.slice().map((item, index) => {
            return <th key={index}>{item}</th>
          })}
        </tr>
      </thead>
    )
  }

  renderTbody() {
    return <tbody>{this.campaignList()}</tbody>
  }

  getDateRange(dateRange) {
    this.setState({ dateRange })
  }

  showCheckDate(e) {
    this.setState({
      showDateEdit: true,
      datepopup: { left: e.target.offsetLeft, top: e.target.offsetTop + 30 },
    })
  }

  hideCheckDate() {
    this.setState({ showDateEdit: false })
  }

  dateInput() {
    const { startDate, endDate } = this.state.dateRange
    const sDate = moment(startDate).format('YYYY年MM月DD日')
    const eDate = moment(endDate).format('YYYY年MM月DD日')
    const values =
      endDate && endDate !== startDate ? sDate + ' ~ ' + eDate : sDate
    return (
      <div className="dateInputcontent">
        <input
          className="checkDateInput"
          placeholder="开始日期"
          value={values}
          onClick={this.showCheckDate}
          readOnly={true}
          style={this.state.showDateEdit ? this.state.dateInputStyle : {}}
        />
      </div>
    )
  }

  totalData() {
    const { checkData } = this.state
    const newtotalData = {
      name: '汇总',
      TWD: 0,
      CNY: 0,
      CV: 0,
      CPA: 0.0,
      PS: null,
    }

    if (checkData.length !== 0) {
      checkData.forEach((value) => {
        newtotalData.TWD += Number(value.TWD)
        newtotalData.CNY += Number(value.CNY)
        newtotalData.CV += Number(value.CV)
      })
    } else {
      const { sourceData } = this.state
      Object.keys(sourceData).forEach((paas) => {
        sourceData[paas].forEach((item) => {
          newtotalData.TWD += Number(item.TWD)
          newtotalData.CNY += Number(item.CNY)
          newtotalData.CV += Number(item.CV)
        })
      })
    }

    newtotalData.CPA = newtotalData.CV
      ? Number((newtotalData.CNY / newtotalData.CV).toFixed(2))
      : 0.0
    return newtotalData
  }

  setTotalData(CV) {
    const totalData = this.totalData()
    totalData.CV = CV
    totalData.CPA = totalData.CV
      ? Number((totalData.CNY / totalData.CV).toFixed(2))
      : 0.0
    this.setState({ totalData })
    return totalData
  }

  getSeverData() {
    const { dateRange } = this.state
    moment(dateRange).format('YYYYMMDD')
    Axios.get('https://popin.licat.work/api/getproject', {
      params: {
        project: 'QB1119',
        date: moment(dateRange).format('YYYYMMDD'),
      },
      responseType: 'json',
    })
      .then((result) => {
        console.log(result.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <Fragment>
        <div className="tableTitle">
          <h1>广告消耗数据表</h1>
        </div>
        <div className="dateInput">
          <div className="dateInputLable">日期</div>
          {this.dateInput()}
          <div className="submitDateBtn" onClick={this.getSeverData}>
            指定时间
          </div>
        </div>
        <table>
          {this.renderThead()}
          {this.renderTbody()}
          <TotalCharge
            totalData={this.state.totalData || this.totalData()}
            setTotalData={this.setTotalData}
          />
        </table>
        <div className="CampaignForm">
          <CampaignForm />
        </div>
        {this.state.showDateEdit && (
          <Fragment>
            <section
              className="editDateBackground"
              onClickCapture={this.hideCheckDate}
            ></section>
            <div style={this.state.datepopup} className="editDate">
              <DateRangeCheck
                getDateRange={this.getDateRange}
                initialDate={this.state.dateRange}
              />
            </div>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default ChargeTable
