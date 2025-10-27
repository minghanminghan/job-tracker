"use client"

import { Box, Typography } from "@mui/material";
import { FunnelChart, Funnel, LabelList, Tooltip } from "recharts"
import { useEffect, useRef } from 'react'
import CalHeatmap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'

type funnelDataType = {
    name: string
    value: number
    fill: string
}

export default function Dashboard({ funnelData, heatmapData }: { funnelData: funnelDataType[], heatmapData: { date: string; value: number }[] }) {
    const calRef = useRef<HTMLDivElement>(null)
    const calInstance = useRef<any>(null)

    useEffect(() => {
    if (!calRef.current) return

    const cal = new CalHeatmap();
    calInstance.current = cal

    cal.paint({
      itemSelector: calRef.current,
      data: {
        source: heatmapData,
        x: 'date',
        y: 'value'
      },
      date: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 11))
      },
      range: 12,
      domain: {
        type: 'month',
        gutter: 10,
        label: { text: 'MMM', textAlign: 'start' }
      },
      subDomain: {
        type: 'day',
        radius: 2,
        width: 15,
        height: 15,
        gutter: 4
      },
      scale: {
        color: {
          type: 'threshold',
          range: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
          domain: [1, 3, 5, 8]
        }
      }
    });

    return () => {
      cal.destroy()
    }
  }, [heatmapData])
    return (
        <div>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
                height: '100%',
            }}>
                <Typography>Count by Status</Typography>
                <FunnelChart style={{
                    width: '100%',
                    maxWidth: 600,
                    maxHeight: '70vh',
                    aspectRatio: 1.618
                }}
                >
                    <Tooltip />
                    <Funnel
                        dataKey="value"
                        nameKey="name"
                        data={funnelData}
                    >
                        <LabelList position="inside" fill="#000" stroke="none" />
                    </Funnel>
                </FunnelChart>
                <Typography>Heatmap</Typography>
                <div ref={calRef}/>
            </Box>
        </div>
    )
}