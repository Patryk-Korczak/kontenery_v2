// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { useQuery } from 'react-query';
import React, { useEffect, useRef, useState } from 'react';
import {
  AppBar, Container, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select,
  Toolbar, Typography
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SelectInput from '@mui/material/Select/SelectInput';

const columns: GridColDef[] = [
  { field: 'id',
    headerName: 'ID',
    width: 300,
    align: 'center'
  },
  {
    field: 'deviceId',
    headerName: 'Device Id',
    type: 'string',
    width: 250,
    align: 'center'
  },
  {
    field: 'payload',
    headerName: 'Value',
    type: 'number',
    width: 150,
    align: 'center'
  },
  {
    field: 'timestamp',
    headerName: 'Time',
    type: 'string',
    width: 400,
    align: 'center'
  }
];

export function App() {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const {
    isLoading,
    isError,
    data,
    error
  } = useQuery<any[]>('data', async () => (await fetch('http://192.168.0.57:8081/v1/data', { method: 'GET' })).json());

  const {
    isLoading: isSeriesLoading,
    isError: isSeriesError,
    data: series,
    error: seriesError
  } = useQuery<any[]>('series', async () => (await fetch('http://192.168.0.57:8081/v1/series', { method: 'GET' })).json());

  const [deviceId, setDeviceId] = useState("")

  if (isError || isSeriesError) {
    return <span>Error ||| data:{JSON.stringify(error)} series: {JSON.stringify(seriesError)}</span>;
  }

  useEffect(() => {
    if(deviceId !== "" && !!series) {
      chartComponentRef?.current?.chart.update({series: []}, true, true);
      chartComponentRef?.current?.chart.addSeries(
        series.find(x => x.name === deviceId)
      );

      chartComponentRef?.current?.chart.redraw(true);
      chartComponentRef?.current?.chart.reflow();
    }
  }, [deviceId, series]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Data Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false}>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={6}>
            <Paper elevation={10}>
              {
                (() => {
                  if (isLoading || !data) {
                    return <LinearProgress />;
                  }

                  return  <DataGrid
                    rows={data.map(data => ({ ...data, id: data._id }))}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 20
                        }
                      }
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                  />;
                })()
              }
            </Paper>
          </Grid>
          <Grid item xs={6} height='auto'>
            <FormControl fullWidth margin="normal">
              <InputLabel id="device-id-label">Device ID</InputLabel>
              <Select
                labelId="device-id-label"
                id="device-id-select"
                value={deviceId}
                label="Device ID"
                onChange={(e) => setDeviceId(e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {series?.map(s => (
                  <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Paper elevation={3}>
              {
                (() => {
                  if (isSeriesLoading || !series) {
                    return <LinearProgress />;
                  }
                  return (
                    <HighchartsReact
                      ref={chartComponentRef}
                      highcharts={Highcharts}
                      allowChartUpdate={true}
                      immutable={false}
                      updateArgs={[true, true, false]}
                      options={{
                        chart: {
                          type: 'spline', // or 'line', 'area', etc., depending on your preference
                          height: "100%"
                        },
                        title: {
                          text: 'Device Data Over Time'
                        },
                        xAxis: {
                          type: 'datetime',
                          title: {
                            text: 'Time'
                          }
                        },
                        yAxis: {
                          title: {
                            text: 'Payload Value'
                          }
                        },
                        time: {
                          useUTC: true
                        },
                        legend: {
                          enabled: true
                        },
                        tooltip: {
                          headerFormat: '<b>{series.name}</b><br>',
                          pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
                        },
                      }}
                    />
                  );
                })()
              }
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
