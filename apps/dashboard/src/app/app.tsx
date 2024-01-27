// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { useQuery } from 'react-query';
import React from 'react';
import {
  AppBar, Container, Grid, LinearProgress, Paper,
  Toolbar, Typography
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

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
  const {
    isLoading,
    isError,
    data,
    error
  } = useQuery<any[]>('data', async () => (await fetch('http://192.168.0.57/v1/data', { method: 'GET' })).json());

  const {
    isLoading: isSeriesLoading,
    isError: isSeriesError,
    data: series,
    error: seriesError
  } = useQuery<any[]>('series', async () => (await fetch('http://192.168.0.57/v1/series', { method: 'GET' })).json());

  console.log(series);

  if (isError || isSeriesError) {
    return <span>Error ||| data:{JSON.stringify(error)} series: {JSON.stringify(seriesError)}</span>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Data Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
        <Grid container spacing={5}>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  type: 'line'
                },
                title: {
                  text: 'Test Chart'
                },
                xAxis: {
                  type: 'datetime'
                },
                yAxis: {
                  title: {
                    text: 'Value'
                  }
                },
                series: [{
                  name: 'Sample Series',
                  data: [
                    [Date.UTC(2024, 0, 1), 29.9],
                    [Date.UTC(2024, 1, 2), 71.5],
                    [Date.UTC(2024, 2, 3), 106.4]
                  ]
                }]
              }}
            />
            <Paper elevation={10}>
              {
                (() => {
                  if (isSeriesLoading || !series) {
                    return <LinearProgress />;
                  }
                  return (
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: {
                          type: 'line' // or 'line', 'area', etc., depending on your preference
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
                          enabled: false
                        },
                        tooltip: {
                          headerFormat: '<b>{series.name}</b><br>',
                          pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
                        },
                        series: JSON.parse(JSON.stringify(data))
                      }}
                    />
                  );
                })()
              }
            </Paper>
          </Grid>
        </Grid>
    </>
  );
}

export default App;
