/**
 * Filter the given object using the predicate function
 * @param {(key: keyof Obj, value: any) => boolean} predicateFn
 * @returns {(object: Obj) => Obj} (object) => filteredObj
 *
 * @example
 *
 * const unfilteredObject = {a:1,b:2,c:3,d:4,e:5};
 *
 * const isLargerThan = (a:number)=> (numberToCompare:number)=> numberToCompare > a;
 *
 * filterObject((key,value)=> isLargerThan(2)(value))(unfilteredObject)
 * // => {c:3,d:4,e:5}
 *
 * filterObject((key,value)=> isLargerThan(4)(value))(unfilteredObject)
 * // => {d:4,e:5}
 */
function filterObject<Obj extends Record<string, any>>(
  predicateFn: (key: keyof Obj, value: any) => boolean
): (object: Obj) => Obj {
  return (object: Obj): Obj =>
    Object.entries(object).reduce((filtered, [key, value]) => {
      if (predicateFn(key, value)) {
        // @ts-ignore: No index signature with a parameter of type 'string' was found on type '{}'
        filtered[key] = value;
      }

      return filtered;
    }, {}) as Obj;
}

function filterTruthyObjectValues<Obj extends Record<string, any>>(object: Obj) {
  return filterObject<Obj>((_key, value) => Boolean(value))(object);
}

/**
 * Checks the given value if the value is object and not an array or null.
 * @param {unknown} x The value to check.
 * @returns {boolean} Returns `true` if `value` is an object and not an array or null, else returns `false`.
 * @example
 *
 * isRecord({})
 * // => true
 *
 * isRecord({a: "1"})
 * // => true
 *
 * isRecord(new Foo);
 * // => true
 *
 * isRecord([1, 2, 3])
 * // => false
 *
 * isRecord(Function)
 * // => false
 *
 * isRecord(null)
 * // => false
 */
function isRecord(x: unknown): x is Record<string, any> {
  return typeof x === "object" && Boolean(x) && !Array.isArray(x);
}

function isEmptyObject(object: Record<string, any>): boolean {
  return Object.keys(object).length === 0;
}

export {filterObject, filterTruthyObjectValues, isRecord, isEmptyObject};
