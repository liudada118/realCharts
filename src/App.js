import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import './App.css'
let dateArr = []
export const err = [60, 60, 60, 60, 60, 60, 60, 60]
// export const initialArr = [435, 487, 481, 527, 504, 382, 457, 608]
//  
let nowRes = [], now1Res = [], allRes = [], now2Res = [], now3Res = []
export const dataArr = new Array(8)
export const dataArr1 = new Array(8)
// let err = 150
let initial = 0
export const initialArr = new Array(8)
export const stableArr = new Array(8)
let wsdata = []
// let flag = 0
// let oldArr = 0
let allInitialArr = []
export const maxArr = []
const minArrArr = new Array(8)
const maxArrArr = new Array(8)
const minArrArr1 = new Array(8)
const maxArrArr1 = new Array(8)
let allArr = []
export const nowdataarr = []
let allnowArr = []
let minFlag = new Array(8).fill(0)
let min1Flag = new Array(8).fill(0)
let maxFlag = new Array(8).fill(0)
export let number

let oldArr = new Array(8).fill(0);
let timeArr = new Array(8);
// let dataArr = [0, 0, 0, 0]
// let dataArr = new Array(8)
// let dataArr1 = new Array(8)
// let stableArr = new Array(8)
let jump = false
let startFlag = false
let flag = 0
let stableFlag = 0
// let time = 0
// let initial = 0
// let initialArr = new Array(8)
let end = 0
let videoStart = false
let stOldArr = new Array(stableArr.length).fill(0)
let stold = new Array(8).fill(0)
let stold1 = new Array(8).fill(0)
// let smooth = new Array(8).fill(0)
let newsmooth = new Array(8).fill(0)
let newsmooth1 = new Array(8).fill(0)
let speedSmooth = 0
let oldsomenum = 0
let diff = 0
let oldDiff = 0
let varpArr = new Array(8)
let suduNum = 0
let suduArr = []
let oldspeed = 0
let varpArr1 = new Array(8)
let yomaData = new Array(8)
for (let i = 0; i < 8; i++) {
  varpArr[i] = []
  varpArr1[i] = []
  yomaData[i] = []
  maxArrArr[i] = []
  minArrArr[i] = []
  maxArrArr1[i] = []
  minArrArr1[i] = []
  // newsmooth[i] = []
  // stold[i] = []
}
let numFlag = true
let allStableNum = 0
function Data(arr) {
  if (arr.length == 1) {
    return 0
  }
  let res = 0
  for (let i = 1; i < arr.length; i++) {
    res += (arr[i] + arr[i - 1]) * (arr[i] - arr[i - 1])
  }
  return res / (arr.length - 1)
}

// for(let i = 0 ; i < 8 ; i ++){

// }

const initCharts = (props) => {


  let option = {
    animation : false,
    title: {
      text: props.name
    },
    tooltip: {
      trigger: 'axis',
      show: 'true'
    },
    xAxis: {
      type: 'category',
      data: props.xData,
      boundaryGap: false,
      // min:props.xData[0], // 起始
      // max:props.xData[props.xData.length -1] // 终止
    },
    yAxis: {
      type: 'value',
      // data: props.index == 8 ? ["平躺", "趴睡", "侧躺"] : '',
      min: 0,
      // max: props.max,
      // max: props.max ? props.max : 'unset',
      minInterval: 1,
      axisLabel: {
        show: true,
        textStyle: {
          color: '#000'
        },

      },


    },
    series: [
      {
        symbol: "none",
        data: props.yData,
        type: 'line',
        smooth: true,
        color: '#000',
        markLine : {
          data : [{
            yAxis : props.have
          },
          {
            yAxis : props.min
          },{
            yAxis : props.max
          },
        ]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 1, color: '#e6e6e6' // 0% 处的颜色
            }, {
              offset: 0, color: '#fff' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },

      },
      {
       
      }
    ],
  };
  // myChart.clear()  
  props.myChart.setOption(option);

  window.addEventListener("resize", function () {
    props.myChart.resize();
  });
}

function small(data) {
  initial++

  if (initial == 1) {
    initial = 2
    // 赋值初始最小值
    for (let i = 0; i < 8; i++) {
      initialArr[i] = (data[i * 4] + 255 * data[i * 4 + 1])
    }
    // 赋值最大初始值
    for (let i = 0; i < 8; i++) {
      maxArr[i] = data[i * 4] + 255 * data[i * 4 + 1] + 30

    }
  }

  for (let i = 0; i < 8; i++) {

    dataArr[i] = data[i * 4] + 255 * data[i * 4 + 1]
    nowdataarr[i] = (dataArr[i] - initialArr[i]) / (maxArr[i] - initialArr[i])
    if (dataArr[i] < initialArr[i]) {
      // if (initialArr[i] < dataArr[i] + 80) {
      //   min1Flag[i]++
      //   if (min1Flag[i] / 5 == 1) {
      //     initialArr[i] = dataArr[i]
      //   }
      // }
      if (minArrArr[i].length < 30) {
        minArrArr[i].push(dataArr[i])
      } else {
        let minArrRes = minArrArr[i].sort((a, b) => a - b)
        initialArr[i] = minArrRes.reduce((a, b, index) => {
          if (index < 5 || index > 24) { return a + 0 } else {
            return a + b
          }
        }) / 20
        minArrArr[i] = []
      }

    } else {
      minArrArr[i] = []
    }


    if (dataArr[i] > maxArr[i]) {
      if (maxArrArr[i].length < 30) {
        maxArrArr[i].push(dataArr[i])
      } else {
        let maxArrRes = maxArrArr[i].sort((a, b) => a - b)
        maxArr[i] = maxArrRes.reduce((a, b, index) => {
          if (index < 5 || index > 24) { return a + 0 } else {
            return a + b
          }
        }) / 20
        maxArrArr[i] = []
      }
    } else {
      maxArrArr[i] = []
    }


    // 第二版
    if (nowdataarr[i] < 0.4 && nowdataarr[i] > 0.05) {

      if (minArrArr1[i].length < 30) {
        minArrArr1[i].push(dataArr[i])
      } else {
        let minArrRes = minArrArr1[i].sort((a, b) => a - b)
        initialArr[i] = minArrRes.reduce((a, b, index) => {
          if (index < 5 || index > 24) { return a + 0 } else {
            return a + b
          }
        }) / 20
        minArrArr1[i] = []
      }
    } else {
      minArrArr1[i] = []
    }

    if (nowdataarr[i] > 0.6 && nowdataarr[i] < 0.8) {
      if (maxArrArr1[i].length < 30) {
        maxArrArr1[i].push(dataArr[i])
      } else {
        let maxArrRes = maxArrArr1[i].sort((a, b) => a - b)
        maxArr[i] = maxArrRes.reduce((a, b, index) => {
          if (index < 5 || index > 24) { return a + 0 } else {
            return a + b
          }
        }) / 20
        maxArrArr1[i] = []
      }
    } else {
      maxArrArr1[i] = []
    }





    dataArr1[i] = nowdataarr[i] > 0.50 ? 1 : 0
    // dataArr1[i] = dataArr[i]> initialArr[i] + 30 ? 1 : 0
    stableArr[i] = data[i * 4] + 255 * data[i * 4 + 1] //> nowdataarr[i] > 0.60 ? data[i * 4] + 255 * data[i * 4 + 1] : 0
    // stableArr[i] = data[i * 4] + 255 * data[i * 4 + 1] > initialArr[i] + err ? data[i * 4] + 255 * data[i * 4 + 1] : 0
  }
  number = nowdataarr.filter((a, index) => a > 0.5).length
  //   return [dataArr1,dataArr]
}

let allData = []
let oldData = 0
let allsmooth = 0, allsmoothArr = []
let other = []




const create = () => {






}

export default function App() {

  const box1 = useRef()
  const box2 = useRef()
  const box3 = useRef()
  const box4 = useRef()
  const box5 = useRef()
  const box6 = useRef()
  const box7 = useRef()
  const box8 = useRef()
  const box9 = useRef()


  useEffect(() => {
    let myChart1 = echarts.init(document.getElementById(`myChart1`));
    let myChart2 = echarts.init(document.getElementById(`myChart2`));
    let myChart3 = echarts.init(document.getElementById(`myChart3`));
    let myChart4 = echarts.init(document.getElementById(`myChart4`));
    let myChart5 = echarts.init(document.getElementById(`myChart5`));
    let myChart6 = echarts.init(document.getElementById(`myChart6`));
    let myChart7 = echarts.init(document.getElementById(`myChart7`));
    let myChart8 = echarts.init(document.getElementById(`myChart8`));

    const ws = new WebSocket('ws://127.0.0.1:9999')
    ws.onopen = (e) => {
      console.log('ws sussess')
    }
    ws.onmessage = (e) => {

      const data = JSON.parse(e.data).data
      small(data)
      // console.log(dataArr)
      stableFlag++

      if (stableFlag % 5 == 0) {
        stableFlag = 0
        for (let i = 0; i < 8; i++) {

          if (varpArr[i].length < 10) {
            // varpArr[i] = []
            varpArr[i].push(stableArr[i])
            allData.push(dataArr.reduce((a, b) => a + b, 0))
            varpArr1[i].push(number != 0 ? parseInt(nowdataarr.reduce((a, b) => { if (b > 0.5) { return a + b } else { return a + 0 } }, 0) * (100 / number)) : 0)
          } else {
            varpArr[i].shift()
            varpArr[i].push(stableArr[i])
            allData.push(dataArr.reduce((a, b) => a + b, 0))
            allData.shift()
            varpArr1[i].shift()
            varpArr1[i].push(number != 0 ? parseInt(nowdataarr.reduce((a, b) => { if (b > 0.5) { return a + b } else { return a + 0 } }, 0) * (100 / number)) : 0)
          }

          newsmooth[i] = newsmooth[i] + (Math.abs(Data(varpArr[i]) - [i]) - newsmooth[i]) / 10 > 20 ? 20 : newsmooth[i] + (Math.abs(Data(varpArr[i]) - stold[i]) - newsmooth[i]) / 10
          newsmooth1[i] = newsmooth1[i] + (Math.abs(Data(varpArr1[i]) - stold1[i]) - newsmooth1[i]) / 2 > 20 ? 20 : newsmooth1[i] + (Math.abs(Data(varpArr1[i]) - stold1[i]) - newsmooth1[i]) / 2
          allsmooth = allsmooth + (Math.abs(Data(allData) - oldData) - allsmooth) / 10
          // console.log(varpArr, newsmooth, Data(varpArr), stold)
          // setStable(newsmooth[7])stold

          // console.log(,)
          // console.log(newsmooth[4], stableArr, newsmooth)
          stold[i] = Data(varpArr[i])
          stold1[i] = Data(varpArr1[i])
          oldData = Data(dataArr)
        }
        // let allsmooth = compoteStable(dataArr.reduce((a, b) => a + b, 0))


        // console.log(newsmooth)
        // newsmooth = newsmooth + (Math.abs(Data(varpArr) - stold) - newsmooth) / 10 > 20 ? 20 : newsmooth + (Math.abs(Data(varpArr) - stold) - newsmooth) / 10
        // console.log(varpArr, newsmooth, Data(varpArr), stold)
        // setStable(newsmooth)
        // 平稳档
        let valueNumber = 0
        let indexarr = []
        dataArr1.filter((a, index) => {
          if (a == 1) {
            indexarr.push(index)
          }
        })
        // console.log(indexarr, newsmooth)
        for (let i = 0; i < indexarr.length; i++) {
          valueNumber += newsmooth[indexarr[i]]
        }
        // valueNumber = valueNumber > 20 ? valueNumber : 0
        // console.log(indexarr, valueNumber)

        // 版本1
        // allStableNum += valueNumber > 25 ? valueNumber : 0

        // 版本2
        if (indexarr.length == 1) {
          allStableNum += valueNumber > 15 ? valueNumber * 3 : 0
        } else if (indexarr.length == 2) {
          allStableNum += valueNumber > 20 ? valueNumber * 2 : 0
        } else {
          allStableNum += valueNumber > 25 ? valueNumber : 0
        }

        let otherNum = newsmooth.reduce((a, b, index) => {
          if (indexarr.includes(index)) {
            return a + 0
          } else {
            return a + b
          }
        }, 0) > 50 ? 50 : newsmooth.reduce((a, b, index) => {
          if (indexarr.includes(index)) {
            return a + 0
          } else {
            return a + b
          }
        }, 0)
        // console.log(otherNum, other.length)
        if (yomaData[0].length < 100) {
          for (let i = 0; i < 8; i++) {
            yomaData[i].push(dataArr[i])
          }
          dateArr.push(1)
          // // allsmoothArr.push(allsmooth)
          // nowRes.push(newsmooth[7])
          // now1Res.push(newsmooth1[7])
          // now2Res.push(dataArr[7])
          // other.push(otherNum)
          // // now3Res.push(newsmooth.reduce((a, b) => a + b, 0))
          // allRes.push(valueNumber)
        } else {

          for (let i = 0; i < 8; i++) {
            yomaData[i].shift()
            yomaData[i].push(dataArr[i])

            // echarts.dispose(document.getElementById(`myChart${i + 1}`))
            // yomaData[i] = []

          }
          dateArr.shift()
          dateArr.push(1)
          // dateArr.push(1)
          // // allsmoothArr.push(allsmooth)
          // nowRes.push(newsmooth[7])
          // now1Res.push(newsmooth1[7])
          // now2Res.push(dataArr[7])
          // other.push(otherNum)
          // // now3Res.push(dataArr.reduce((a, b) => a + b, 0))
          // allRes.push(valueNumber)

          // // allRes.shift()
          // dateArr.shift()
          // allsmoothArr.shift()
          // nowRes.shift()
          // now1Res.shift()
          // now2Res.shift()
          // // now3Res.shift()
          // other.shift()
        }

        // setAllStable(allStableNum)
        // setkll((allStableNum / 3000).toFixed(2))
        // setNowStable(valueNumber)
        // console.log(allStableNum, valueNumber, allsmooth)
        // initCharts({ yData: allRes, xData: dateArr, index: 1, name: '所有' })
        // initCharts({ yData: nowRes, xData: dateArr, index: 2, name: '7真实稳定' })
        // initCharts({ yData: now1Res, xData: dateArr, index: 3, name: '7 100 稳定' })
        // initCharts({ yData: now2Res, xData: dateArr, index: 4, name: '7真实数据 ' })
        // initCharts({ yData: now3Res, xData: dateArr, index: 5, name: '总和数据 ', min: 2700, max: 3500 })
        // initCharts({ yData: allsmoothArr, xData: dateArr, index: 6, name: '总和稳定 ', })
        // initCharts({ yData: other, xData: dateArr, index: 7, name: '除7稳定 ', })


        // initCharts({ yData: yomaData[0], xData: dateArr, index: 1, name: '1' })
        // initCharts({ yData: nowRes, xData: dateArr, index: 2, name: '2' })
        // initCharts({ yData: now1Res, xData: dateArr, index: 3, name: '3' })
        // initCharts({ yData: now2Res, xData: dateArr, index: 4, name: '4 ' })
        // initCharts({ yData: now3Res, xData: dateArr, index: 5, name: '5 ', min: 2700, max: 3500 })
        // initCharts({ yData: allsmoothArr, xData: dateArr, index: 6, name: '6 ', })
        // initCharts({ yData: other, xData: dateArr, index: 7, name: '7 ', })
        // initCharts({ yData: other, xData: dateArr, index: 7, name: '8 ', })
        // for (let i = 0; i < 8; i++) {
        console.log(yomaData[0].length)
        initCharts({ yData: yomaData[0], xData: dateArr, index: 0 + 1, name: 0, min: initialArr[0], max: maxArr[0], myChart: myChart1 , have : (maxArr[0]+initialArr[0])/2, min : initialArr[0],max : maxArr[0]} )
        initCharts({ yData: yomaData[1], xData: dateArr, index: 1 + 1, name: 1, min: initialArr[1], max: maxArr[1], myChart: myChart2 , have : (maxArr[1]+initialArr[1])/2, min : initialArr[1],max : maxArr[1]})
        initCharts({ yData: yomaData[2], xData: dateArr, index: 2 + 1, name: 2, min: initialArr[2], max: maxArr[2], myChart: myChart3 , have : (maxArr[2]+initialArr[2])/2, min : initialArr[2],max : maxArr[2]})
        initCharts({ yData: yomaData[3], xData: dateArr, index: 3 + 1, name: 3, min: initialArr[3], max: maxArr[3], myChart: myChart4 , have : (maxArr[3]+initialArr[3])/2, min : initialArr[3],max : maxArr[3]})
        initCharts({ yData: yomaData[4], xData: dateArr, index: 4 + 1, name: 4, min: initialArr[4], max: maxArr[4], myChart: myChart5 , have : (maxArr[4]+initialArr[4])/2, min : initialArr[4],max : maxArr[4]})
        initCharts({ yData: yomaData[5], xData: dateArr, index: 5 + 1, name: 5, min: initialArr[5], max: maxArr[5], myChart: myChart6 , have : (maxArr[5]+initialArr[5])/2, min : initialArr[5],max : maxArr[5]})
        initCharts({ yData: yomaData[6], xData: dateArr, index: 6 + 1, name: 6, min: initialArr[6], max: maxArr[6], myChart: myChart7 , have : (maxArr[6]+initialArr[6])/2, min : initialArr[6],max : maxArr[6]})
        initCharts({ yData: yomaData[7], xData: dateArr, index: 7 + 1, name: 7, min: initialArr[7], max: maxArr[7], myChart: myChart8 , have : (maxArr[7]+initialArr[7])/2, min : initialArr[7],max : maxArr[7]})

        // }
        // initCharts({ yData: yomaData[0], xData: dateArr, index: 8, name: 7, })
      }


      stOldArr = [...stableArr]

      // if (dataArr1[7]) {
      //   box1.current.style.backgroundColor = '#5b5176'
      // } else {
      //   box1.current.style.backgroundColor = '#f0f0f0'
      // }

      // if (dataArr1[7]) {
      //   box2.current.style.backgroundColor = '#5b5176'
      // } else {
      //   box2.current.style.backgroundColor = '#f0f0f0'
      // }

      // if (dataArr1[4]) {
      //   box3.current.style.backgroundColor = '#5b5176'
      // } else {
      //   box3.current.style.backgroundColor = '#f0f0f0'
      // }
      // if (dataArr1[5]) {
      //   box4.current.style.backgroundColor = '#5b5176'
      // } else {
      //   box4.current.style.backgroundColor = '#f0f0f0'
      // }
      // if (dataArr1[3]) {
      //   box5.current.style.backgroundColor = '#5b5176'
      // } else {
      //   box5.current.style.backgroundColor = '#f0f0f0'
      // }
      // if (dataArr1[2]) {
      //   box6.current.style.backgroundColor = '#5b5176'
      // } else {
      //   box6.current.style.backgroundColor = '#f0f0f0'
      // }
      // if (dataArr1[1]) {
      //   box7.current.style.backgroundColor = '#5b5176'
      // } else {
      //   box7.current.style.backgroundColor = '#f0f0f0'
      // }
      // if (dataArr1[0]) {
      //   box8.current.style.backgroundColor = '#5b5176'
      // } else {
      //   box8.current.style.backgroundColor = '#f0f0f0'
      // }
      // if (dataArr1[0]) {
      //   box9.current.style.backgroundColor = '#5b5176'
      // } else {
      //   box9.current.style.backgroundColor = '#f0f0f0'
      // }
    }

  }, [])
  return (
    <div>
      <button onClick={() => { create() }}>开始</button>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div id="myChart1" style={{ flex: '0 0 40%', height: 230 }}></div>
        <div id="myChart2" style={{ flex: '0 0 40%', height: 230 }}></div>

        <div id="myChart3" style={{ flex: '0 0 40%', height: 230 }}></div>
        <div id="myChart4" style={{ flex: '0 0 40%', height: 230 }}></div>
        <div id="myChart5" style={{ flex: '0 0 40%', height: 230 }}></div>

        <div id="myChart6" style={{ flex: '0 0 40%', height: 230 }}></div>
        <div id="myChart7" style={{ flex: '0 0 40%', height: 230 }}></div>
        <div id="myChart8" style={{ flex: '0 0 40%', height: 230 }}></div>
      </div>
      <div className='yogaMat' style={{ position: 'fixed', top: 0, right: 0, opacity: 0.5 }}>
        <div className="yogamat">
          <div ref={box1} className="yogamatbox boxtl"></div>
          <div ref={box2} className="yogamatbox boxtr"></div>
        </div>
        <div className="bigBox">
          <div className="yogamat">
            <div ref={box3} className="yogamatbox"></div>
            <div ref={box4} className="yogamatbox"></div>
          </div>
          <div ref={box5} className="yogamatbox1"></div>
          <div className="yogamat">
            <div ref={box6} className="yogamatbox"></div>
            <div ref={box7} className="yogamatbox"></div>
          </div>
        </div>
        <div className="yogamat">
          <div ref={box8} className="yogamatbox boxbl"></div>
          <div ref={box9} className="yogamatbox boxbr"></div>
        </div>
      </div>
    </div>
  )
}

