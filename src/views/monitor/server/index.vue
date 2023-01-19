<template>
  <div class="container">
    <div class="left-side">
      <a-spin :loading="loading" style="width: 100%; height: inherit">
        <chart :options="overviewChart" height="80%" />

        <div style="height: 15%; padding-left: 10px">
          <div
            ><a-space style="padding-bottom: 10px">
              <a-tag color="blue"><icon-cloud />{{ info.sys.ip }}</a-tag>
              <a-tag color="arcoblue">已不间断运行：{{ info.sys.day }}</a-tag>
            </a-space></div
          >
          <div
            ><a-space style="padding-bottom: 10px">
              <a-tag color="cyan"><icon-desktop />{{ info.sys.os }}</a-tag>
            </a-space></div
          >
          <div>
            <a-space>
              <a-tag color="orange"><icon-bulb />{{ info.cpu.name }} </a-tag>
              <a-tag color="orange">{{ info.cpu.package }}</a-tag>
              <a-tag color="orange">{{ info.cpu.core }}</a-tag>
              <a-tag color="orange">{{ info.cpu.logic }}</a-tag>
            </a-space>
          </div>
        </div>
      </a-spin>
    </div>
    <div class="right-side">
      <a-spin :loading="loading" style="height: 100%">
        <div>
          <a-card :bordered="false" style="height: 100%">
            <template #title>CPU使用率监控</template>
            <chart :options="cpuMntChart" />
          </a-card>
        </div>
        <div style="background-color: red">
          <a-card :bordered="false" style="height: 100%">
            <template #title>内存使用监控</template>
            <chart :options="memoryMntChart" />
          </a-card>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';

  const { loading, toggle } = useLoading(true);
  const info = ref({
    sys: {
      os: '',
      day: '0小时',
      ip: '',
    },
    cpu: {
      name: '',
      package: '',
      core: '',
      coreNumber: 0,
      logic: '',
      used: '',
      idle: '',
    },
    memory: {
      total: '',
      available: '',
      used: '',
      usageRate: '',
    },
    swap: {
      total: '',
      used: '',
      available: '',
      usageRate: '',
    },
    disk: {
      total: '',
      available: '',
      used: '',
      usageRate: '',
    },
    time: '',
  });

  const gaugeData = [
    {
      value: 0,
      name: 'CPU使用率',
      title: {
        offsetCenter: ['0%', '-60%'],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '-48%'],
      },
    },
    {
      value: 0,
      name: '内存使用率',
      title: {
        offsetCenter: ['0%', '-30%'],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '-18%'],
      },
    },
    {
      value: 0,
      name: '交换区使用率',
      title: {
        offsetCenter: ['0%', '20%'],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '32%'],
      },
    },
    {
      value: 0,
      name: '磁盘使用率',
      title: {
        offsetCenter: ['0%', '50%'],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '62%'],
      },
    },
  ];

  const overviewChart = ref({
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: '#464646',
          },
        },
        axisLine: {
          lineStyle: {
            width: 40,
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: gaugeData,
        title: {
          fontSize: 14,
        },
        detail: {
          fontWeight: 'normal',
          width: 80,
          height: 16,
          fontSize: 14,
          lineHeight: 16,
          color: 'inherit',
          borderColor: 'inherit',
          borderRadius: 20,
          borderWidth: 1,
          borderType: 'dotted',
          formatter: '{value}%',
        },
      },
    ],
    color: ['#4CD263', '#F979B7', '#5EDFD6', '#C9E968'],
  });
  const cpuMntChart = ref({
    color: '#4CD263',
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'line',
        areaStyle: {},
      },
    ],
  });
  const memoryMntChart = ref({
    color: '#F979B7',
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'line',
        areaStyle: {},
      },
    ],
  });

  watch(info, () => {
    // 左侧仪表盘
    (overviewChart.value as any).series[0].data[0].value = info.value.cpu.used;
    (overviewChart.value as any).series[0].data[1].value =
      info.value.memory.usageRate;
    (
      overviewChart.value as any
    ).series[0].data[1].name = `内存 ${info.value.memory.used}/${info.value.memory.total}`;
    (overviewChart.value as any).series[0].data[2].value =
      info.value.swap.usageRate;
    (
      overviewChart.value as any
    ).series[0].data[2].name = `交换区 ${info.value.swap.used}/${info.value.swap.total}`;
    (overviewChart.value as any).series[0].data[3].value =
      info.value.disk.usageRate;
    (
      overviewChart.value as any
    ).series[0].data[3].name = `磁盘 ${info.value.disk.used.trim()}/${
      info.value.disk.total
    }`;

    // 右侧CPU和内存
    if (cpuMntChart.value.xAxis.data.length >= 7) {
      (cpuMntChart.value.series[0].data as string[]).shift();
      (cpuMntChart.value.xAxis.data as string[]).shift();
      (memoryMntChart.value.series[0].data as string[]).shift();
      (memoryMntChart.value.xAxis.data as string[]).shift();
    }
    (cpuMntChart.value.series[0].data as string[]).push(info.value.cpu.used);
    (cpuMntChart.value.xAxis.data as string[]).push(info.value.time);
    (memoryMntChart.value.series[0].data as string[]).push(
      info.value.memory.usageRate
    );
    (memoryMntChart.value.xAxis.data as string[]).push(info.value.time);
  });

  const getInfo = async () => {
    const { data } = await axios.get('monitor/server');
    info.value = data;
  };

  let id: any;
  onMounted(async () => {
    await getInfo();
    toggle();
    id = setInterval(getInfo, 3000);
  });

  onUnmounted(() => {
    clearInterval(id);
  });
</script>

<script lang="ts">
  export default {
    name: 'Server',
  };
</script>

<style scoped>
  .container {
    display: flex;
    height: 100%;
    padding-top: 16px;
    padding-right: 20px;
    padding-left: 20px;
  }

  .left-side {
    flex: 1;
    height: 100%;
    overflow: auto;
    background-color: var(--color-bg-2);
    border-radius: 5px;
  }

  .right-side {
    width: 650px;
    height: 100%;
    margin-left: 16px;
    background-color: var(--color-bg-2);
    border-radius: 5px;
  }

  .right-side div {
    width: 100%;
    height: 50%;
  }

  :deep(.arco-card-body) {
    height: 100%;
  }
</style>
