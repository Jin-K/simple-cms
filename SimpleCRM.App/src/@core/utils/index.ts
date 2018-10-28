export class CoreUtils {

  public static mergeExistingProperties(a: any, b: any): any {
    for (const i in b) {
      if (a.hasOwnProperty(i)) {
        if (typeof a[i] === 'object' && typeof b[i] === 'object')
        CoreUtils.mergeExistingProperties(a[i], b[i]);
        else
          a[i] = b[i];
      }
    }

    return a;
  }

}
