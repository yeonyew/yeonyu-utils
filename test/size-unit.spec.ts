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
import { SizeUnit, UnitType } from '../src';
import { cutoffFixed } from '../src/SizeUnit';

describe('SizeUnit', function () {
  describe('Basic', function () {
    it('value is 0', function () {
      const size0 = new SizeUnit(0, UnitType.BYTE);
      console.log(size0, size0.value);
      assert.equal(size0.value, 0);
    });

    it('value is not 7', function () {
      const size8 = new SizeUnit(8, UnitType.BYTE);
      console.log(size8, size8.value);
      assert.notEqual(size8.value, 7);
    });

    it('auto cutoff point binary type', function () {
      const size4p5 = new SizeUnit(4.5, UnitType.BYTE);
      console.log(size4p5);
      assert.equal(size4p5.value, 4);
    })

    it('value is 1.2', function () {
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
      const m4 = new SizeUnit(4 * 1024 ** 2, UnitType.BIN_BYTE, 0, { isBinary: true });
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

    it('cutoff value 0', function () {
      const v0 = new SizeUnit(0, UnitType.DEFAULT, 2, { isCutoffFixed: true });
      console.log(v0);
      assert.equal(v0.value, 0);
    });
  });

  describe('Custom Base and Units', function () {
    function customKoreanSize(testSize: number) {
      if (Math.abs(testSize) < 10000) {
        return new SizeUnit(testSize, undefined, undefined, { customUnits: ['', '천'] });
      } else {
        return new SizeUnit(testSize, undefined, 1, {
          customBase: 10000,
          customUnits: ['', '만', '억', '조', '경', '해'],
          isToLocaleString: true,
          customValue: (size, fixed, sign) => {
            if (size < 10) {
              return sign * Number(size.toFixed(fixed));
            } else {
              return sign * Number(cutoffFixed(size, 0));
            }
          },
        });
      }
    }

    const CHUN_BAEC = 1100;
    const orientalCustom0 = customKoreanSize(CHUN_BAEC);
    console.log(orientalCustom0, orientalCustom0.toString());
    const BAEC_OHSHIP = 150;
    const orientalCustom1 = customKoreanSize(BAEC_OHSHIP);
    console.log(orientalCustom1, orientalCustom1.toString());
    const SHIP_ILMAN_CHUN = 111000;
    const orientalCustom2 = customKoreanSize(SHIP_ILMAN_CHUN);
    console.log(orientalCustom2, orientalCustom2.toString());
    const NEG_SHIP_ILMAN_CHUN = -111000;
    const orientalCustom3 = customKoreanSize(NEG_SHIP_ILMAN_CHUN);
    console.log(orientalCustom3, orientalCustom3.toString());
    const CHUN_BAEC_SHIP_ILMAN_CHUN = 11111000;
    const orientalCustom4 = customKoreanSize(CHUN_BAEC_SHIP_ILMAN_CHUN);
    console.log(orientalCustom4, orientalCustom4.toString());
  });
});
