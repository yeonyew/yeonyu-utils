# yeonyu-utils
yeonyu's typescript(javascript) utils to use the frequently 


## SizeUnit
About the transformation in thousand units.
It is based on the premise of a single tone, and the computed value stored in the _result is freeze.

---
**⚠️WARNING**

This conversion works within the Browser `Number` range calculation and does not guarantee errors.

---


### Constructor parameters

<table>
    <tr>
        <td>size</td>
        <td>number | string (casting <code>Number</code>)</td>
        <td>required</td>
    </tr>
    <tr>
        <td>unitType</td>
        <td><code>UnitType</code></td>
        <td>default <code>UnitType.DEFAULT</code></td>
    </tr>
<tr>
        <td>fixed</td>
        <td>number</td>
        <td>optional</td>
    </tr>
<tr>
    <td>options</td>
    <td><code>SizeUnitOptions</code></td>
<td>optional</td>
</tr>
</table>


### types

#### UnitType
```typescript
enum UnitType {
  DEFAULT, // K, M, G, T, P, E, Z, Y
  BYTE, // KB, MB, GB ...
  BIN_BYTE, // KiB, MiB, GiB ...
  BPS, // Kbps, Mbps ...
  FREQ, // KHz, MHz
}
```

#### SizeUnitOptions
```typescript
interface SizeUnitOptions {
  fixedUnit?: number
/**
 * if 'true' not use Number.toFixed in the fixed parameter and instead cut off as much as fixed
 */
  isCutoffFixed?: boolean;
  isBinary?: boolean;
  customBase?: number;
  customUnits?: string[];
}
```


