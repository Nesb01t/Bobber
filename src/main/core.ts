import { app } from 'electron'
import koffi from 'koffi'
import path from 'path'

export const useCore = () => {
  const appPath = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.resolve(__dirname, '../../resources')
  const dllPath = path.join(appPath, '..', 'app.asar.unpacked', 'resources', 'export.dll')
  const dll = koffi.load(
    app.isPackaged ? dllPath : path.resolve(__dirname, '../../resources/export.dll')
  )

  let coreLaunched = false
  const deviceInfo: {
    list: string[]
    selectedIdx: number
    count: number
  } = {
    list: [],
    selectedIdx: 0,
    count: 0
  }

  const getCoreLaunched = () => coreLaunched
  const setCoreLaunched = (state: boolean) => {
    coreLaunched = state
  }

  koffi.struct('TestStruct', {
    a: 'int',
    b: 'string'
  })

  // core
  const StartCore = dll.func('bool StartCore()')
  const RestartCore = dll.func('void RestartCore()')

  // device
  const GetDeviceCount = dll.func('int GetDeviceCount()')
  const SelectDevice = dll.func('void SelectDevice(int)')
  const GetPeakValue = dll.func('float GetPeakValue()')

  // key input
  const PressKey = dll.func('void PressKey(int)')

  const Debug = () => {
    // 修改对象
    // const func = dll.func('void TestStructFunction(_Inout_ TestStruct* structPtr) ')
    // const test = {
    //   a: 1,
    //   b: 'test'
    // }
    // func(test)
    // console.log(test)
    // 修改数组
    // const arr = ['1', '2', '3', null]
    // const func = dll.func('void TestArrayFunction(_Inout_ char** arr, int size)')
    // func(arr, arr.length - 1)
  }

  const InitDeviceInfo = () => {
    deviceInfo.count = GetDeviceCount()
    for (let i = 0; i < deviceInfo.count; i++) {
      const func = dll.func('const char* GetDeviceName(int index)')
      const output: string = func(i)

      const match = output.match(/\(([^)]+)\)/)
      if (match) {
        deviceInfo.list.push(match[1])
      } else {
        deviceInfo.list.push(output)
      }
    }
  }

  return {
    deviceInfo,
    InitDeviceInfo,

    getCoreLaunched,
    setCoreLaunched,
    Debug,

    StartCore,
    RestartCore,
    GetDeviceCount,
    SelectDevice,
    GetPeakValue,
    PressKey
  }
}
