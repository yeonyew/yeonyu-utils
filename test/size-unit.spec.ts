/*
 * yeonyu-utils
 *
 * Copyright (c) 2021. yeonyu. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { assert } from 'chai';
import { SizeUnit, UnitType } from "../src";

describe('SizeUnit', function() {
  describe('#constructor()', function() {
    const size0 = new SizeUnit(0, UnitType.BYTE);
    console.log(size0);
    const size8 = new SizeUnit(8, UnitType.BYTE);
    console.log(size8);
    const size4p4 = new SizeUnit(4.4, UnitType.BYTE);
    console.log(size4p4);

    it('value is 1.2', function() {
      const size1200 = new SizeUnit(1200);
      console.log(size1200, size1200.value);
      assert.equal(size1200.value, 1.2);
    });
  });
  describe('#toString()', function () {
    it('return 4 M', function () {
      const m4 = new SizeUnit(4000000);
      console.log(m4.toString());
      assert.equal(m4.toString(), '4 M');
    });
    it('return 4 MB', function () {
      const m4 = new SizeUnit(4000000, UnitType.BYTE);
      console.log(m4.toString());
      assert.equal(m4.toString(), '4 MB');
    });
    it('return 4 MiB', function () {
      const m4 = new SizeUnit(4 * 1024 ** 2, UnitType.BIN_BYTE, 0,{ isBinary: true });
      console.log(m4.toString());
      assert.equal(m4.toString(), '4 MiB');
    });
  });
  describe('#fixed', function () {
    it('4748 return 4.7 K', function () {
      const k44 = new SizeUnit(4740, undefined, 1);
      console.log(k44, k44.toString());
      assert.equal(k44.toString(), '4.7 K');
    });
  });
});
