import { NativeModulesProxy } from '@unimodules/core';
import * as SecureStore from '../SecureStore';

import { mockPlatformIOS } from '../../test/mocking';

it(`sets values`, async () => {
  const testKey = 'key-test_0.0';
  const testValue = 'value `~!@#$%^&*();:\'"-_.,<>';
  const options = { keychainService: 'test' };
  await SecureStore.setItemAsync(testKey, testValue, options);

  expect(NativeModulesProxy.ExpoSecureStore.setValueWithKeyAsync).toHaveBeenCalledTimes(1);
  expect(NativeModulesProxy.ExpoSecureStore.setValueWithKeyAsync).toHaveBeenCalledWith(
    testValue,
    testKey,
    options
  );
});

it(`provides default options when setting values`, async () => {
  await SecureStore.setItemAsync('key', 'value');
  expect(NativeModulesProxy.ExpoSecureStore.setValueWithKeyAsync).toHaveBeenCalledWith(
    'value',
    'key',
    {}
  );
});

it(`gets values`, async () => {
  NativeModulesProxy.ExpoSecureStore.getValueWithKeyAsync.mockImplementation(async () => 'value');

  const options = { keychainService: 'test' };
  const result = await SecureStore.getItemAsync('key', options);
  expect(result).toBe('value');
  expect(NativeModulesProxy.ExpoSecureStore.getValueWithKeyAsync).toHaveBeenCalledWith(
    'key',
    options
  );
});

it(`deletes values`, async () => {
  const options = { keychainService: 'test' };
  await SecureStore.deleteItemAsync('key', options);
  expect(NativeModulesProxy.ExpoSecureStore.deleteValueWithKeyAsync).toHaveBeenCalledWith(
    'key',
    options
  );
});

it(`checks for invalid keys`, async () => {
  NativeModulesProxy.ExpoSecureStore.getValueWithKeyAsync.mockImplementation(
    async () => `unexpected value`
  );

  await expect(SecureStore.getItemAsync(null as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync(true as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync({} as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync((() => {}) as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync('@')).rejects.toMatchSnapshot();

  expect(NativeModulesProxy.ExpoSecureStore.getValueWithKeyAsync).not.toHaveBeenCalled();
});

it(`checks for invalid values`, async () => {
  await expect(SecureStore.setItemAsync('key', null as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.setItemAsync('key', true as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.setItemAsync('key', {} as any)).rejects.toMatchSnapshot();
  await expect(SecureStore.setItemAsync('key', (() => {}) as any)).rejects.toMatchSnapshot();

  expect(NativeModulesProxy.ExpoSecureStore.setValueWithKeyAsync).not.toHaveBeenCalled();
});

it(`exports accessibility options on iOS`, () => {
  mockPlatformIOS();

  expect(SecureStore.AFTER_FIRST_UNLOCK).toMatchSnapshot('AFTER_FIRST_UNLOCK');
  expect(SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY).toMatchSnapshot(
    'AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY'
  );
  expect(SecureStore.ALWAYS).toMatchSnapshot('ALWAYS');
  expect(SecureStore.ALWAYS_THIS_DEVICE_ONLY).toMatchSnapshot('ALWAYS_THIS_DEVICE_ONLY');
  expect(SecureStore.WHEN_UNLOCKED).toMatchSnapshot('WHEN_UNLOCKED');
  expect(SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY).toMatchSnapshot(
    'WHEN_UNLOCKED_THIS_DEVICE_ONLY'
  );
  expect(SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY).toMatchSnapshot(
    'WHEN_PASSCODE_SET_THIS_DEVICE_ONLY'
  );
});
