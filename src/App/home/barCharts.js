import echarts from "echarts"


export default function makeOptList(data){
    let xLabel = [],
     total = [] ,
     received = [],
     receiving = []

    data.forEach(it=>{
         xLabel.push(it.date)
         total.push(it.total)
         received.push(it.received)
         receiving.push(it.receiving)
    })

  
//     date: "2020-12-01"
// received: 44758
// receiving: 77980
// total: 51954
    return {
   
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['总应收', '已收', '未收'],
            align: 'right',
            right: 'center'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            axisTick:{
              show:false
            },
            type: 'category',
            // data: ['2021-12-01', '2021-12-02', '2021-12-03', '2021-12-04', '2021-12-05', '2021-12-06', '2021-12-07', '2021-12-08'],
            data: xLabel,
            axisLabel: {
                color:'#999',
                rotate: 20
            },
            axisLine:{
              symbol:['none','arrow'],
              symbolSize:[6,6]
            }
        }],
        yAxis: [{
            axisTick:{
              show:false
            },
            splitLine:{
              show:false
            },
            
            type: 'value',
            name: '总价(万元)',
            axisLabel: {
                formatter: '{value}',
                color:'#999'
            }
        }],
        series: [{
            name: '总应收',
            type: 'bar',
            data: total
        }, {
            name: '已收',
            type: 'bar',
            data: received
        }, {
            name: '未收',
            type: 'bar',
            data: receiving
        }]
    };
}