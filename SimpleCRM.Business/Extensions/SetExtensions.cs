using System;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace SimpleCRM.Business.Extensions {

  static class SetExtensions {
    /* Thanks to https://stackoverflow.com/a/47464834 */
    public static DbSet<T> GenericSet<T>(this DbContext context) where T : class {
      // Get the generic type definition
      MethodInfo method = typeof(DbContext).GetMethod(nameof(DbContext.Set), BindingFlags.Public | BindingFlags.Instance);

      // Build a method with the specific type argument you're interested in
      method = method.MakeGenericMethod( typeof( T ) );

      var temp = method.Invoke(context, null) as DbSet<T>;

      return temp;
    }

    internal static IQueryable<T> AsGenericQueryableSet<T>(this DbContext context, string property)
      => context.GetType()
        .GetProperty(property.UppercaseFirst(), BindingFlags.Public | BindingFlags.Instance)
        .GetValue(context, null) as IQueryable<T>;

    internal static T FindById<T>(this DbContext context, int id, string property) where T : class {
      PropertyInfo prop = context.GetType().GetProperty(property, BindingFlags.Public | BindingFlags.Instance);
      Type requiredType = prop.PropertyType.GenericTypeArguments[0];
      Type requiredGenericDbSetType = typeof(DbSet<>).MakeGenericType(requiredType);
      MethodInfo method = requiredGenericDbSetType.GetMethod(nameof(DbSet<object>.Find), BindingFlags.Public | BindingFlags.Instance);
      var set = prop.GetValue(context, null);
      return (T) method.Invoke( set, new object[] { new object[] { id } } );
    }

    internal static string UppercaseFirst(this string s) {
      if (string.IsNullOrEmpty(s)) return "";
      char[] a = s.ToCharArray();
      a[0] = char.ToUpper(a[0]);
      return new string(a);
    }
  }
}
