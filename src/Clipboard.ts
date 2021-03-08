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

export interface VanillaCopyParams {
  value: string | number;
  id?: string;
  callback?: () => void;
}

export const copyToClipboard = async ({value, id, callback}: VanillaCopyParams) => {
  let inputId = "vanilla-copy";
  if (id) {
    inputId = id;
  }
  const findVanillaCopy = document.querySelector(`#${inputId}`);
  let vanillaCopy: any;
  if (findVanillaCopy) {
    vanillaCopy = findVanillaCopy;
  } else {
    vanillaCopy = document.createElement("input");
    vanillaCopy.setAttribute("id", "vanilla-copy");
    vanillaCopy.setAttribute("type", "text");
    vanillaCopy.style.position = "absolute";
    vanillaCopy.style.left = "-1000px";
    vanillaCopy.style.top = "-1000px";
    document.body.appendChild(vanillaCopy);
  }
  if (vanillaCopy) {
    vanillaCopy.value = value;
    vanillaCopy.focus();
    vanillaCopy.select();
    await document.execCommand("copy");
    vanillaCopy.value = "";

    (callback as Function)?.call(null);
  }
};

export default {
  copyToClipboard,
}
