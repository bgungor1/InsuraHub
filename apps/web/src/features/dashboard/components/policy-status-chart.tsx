'use client';

import * as React from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import type { PolicyStateCount } from '../types/dashboard.types';

interface PolicyStatusChartProps {
  data: PolicyStateCount[];
}

export function PolicyStatusChart({ data }: PolicyStatusChartProps) {
  const chartId = React.useId().replace(/:/g, '_');

  React.useLayoutEffect(() => {
    const root = am5.Root.new(chartId);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(55),
      }),
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'count',
        categoryField: 'label',
        alignLabels: false,
      }),
    );

    series.slices.template.setAll({
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
      cornerRadius: 4,
    });

    series.labels.template.set('visible', false);
    series.ticks.template.set('visible', false);

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 10,
      }),
    );

    legend.data.setAll(series.dataItems);

    const activeData = data.filter((d) => d.count > 0);
    series.data.setAll(activeData.length > 0 ? activeData : [{ label: 'Kayıt Yok', count: 1 }]);
    series.appear(800, 100);

    return () => {
      root.dispose();
    };
  }, [data, chartId]);

  return <div id={chartId} className="h-[280px] w-full" />;
}
