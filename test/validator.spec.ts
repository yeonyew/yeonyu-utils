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
import { isEmail } from "../src/Validator";

describe('Validation', function() {
  describe('#email()', function () {
    // only complete email
    it('abc@example.com', function() {
      assert.equal(isEmail("abc@example.com"), true);
    });
    // false test
    it('abc@example -> false', function() {
      assert.equal(isEmail("abc@example"), false);
    });
    // length test
    it('"abc@example.com", length limit: 8 -> false', function() {
      assert.equal(isEmail("abc@example.com", 8), false);
    });
  })
})
