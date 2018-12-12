#region using statements
using System;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
#endregion

namespace SimpleCRM.Business.Extensions {

  /// <summary>
  /// The main SetExtensions class
  /// Contains some help methods, utilities
  /// </summary>
  static class SetExtensions {

    /// <summary>
    /// Finds a <see cref="DbSet" />{<see cref="TEntity" />} from the queried <paramref name="property" /> (even if typeof(TEntity) != typeof(UEntity) where UEntity is the generic type of the found DbSet)
    /// and converts it to a <see cref="IQueryable" />{<see cref="TEntity" />}
    /// </summary>
    /// <typeparam name="TEntity">entity generic type of result</typeparam>
    /// <param name="context">(this) database context</param>
    /// <param name="property">table / propery name of the original db set</param>
    /// <returns>Returns a queryable version of the found DbSet property</returns>
    internal static IQueryable<TEntity> AsGenericQueryableSet<TEntity>(this DbContext context, string property)
    => context.GetType()
              .GetProperty(property.UppercaseFirst(), BindingFlags.Public | BindingFlags.Instance)
              .GetValue(context, null) as IQueryable<TEntity>;

    /// <summary>
    /// Finds an item of type <paramref name="T" /> in database, 
    /// depending on the given <paramref name="property" /> (table)
    /// and the <paramref name="id" /> of that item (in specified table).
    /// </summary>
    /// <remarks>
    /// Works a lot with <see cref="System.Reflection" />
    /// </remarks>
    /// <typeparam name="T">entity generic type of result</typeparam>
    /// <param name="context">(this) database context</param>
    /// <param name="id">id of the item we search</param>
    /// <param name="property">table / propery name of the original db set</param>
    internal static T FindById<T>(this DbContext context, int id, string property) where T : class {

      // get the DbSet<> property info of the queried property
      PropertyInfo propInfo = context.GetType().GetProperty(property, BindingFlags.Public | BindingFlags.Instance);

      // find and get the type of that property
      Type genericType = propInfo.PropertyType.GenericTypeArguments[0];

      // manually create type of DbSet<U> where U = genericType.GetType();
      Type requiredGenericDbSetType = typeof(DbSet<>).MakeGenericType(genericType);

      /// get method info of the EF core <see cref="DbSet{TEntity}.Find(object[])" /> method
      MethodInfo method = requiredGenericDbSetType.GetMethod(nameof(DbSet<object>.Find), BindingFlags.Public | BindingFlags.Instance);

      // obtain actual value of the found property before and keep reference in "set"
      var set = propInfo.GetValue(context, null);

      // invoke the found EF core method (Find) on that "set" and return the result casted as T
      return (T) method.Invoke( set, new object[] { new object[] { id } } );
    }

    /// <summary>
    /// Converts first char of any string ( <paramref name="str" /> ) to upperCase
    /// </summary>
    /// <param name="str">original string to convert</param>
    /// <returns>Returns result in a new string</returns>
    internal static string UppercaseFirst(this string str) {

      // return empty if empty or null
      if (string.IsNullOrEmpty(str)) return "";

      // convert to char array
      char[] a = str.ToCharArray();
      
      // first char to uppercase
      a[0] = char.ToUpper(a[0]);

      // return new string of char array
      return new string(a);
    }
  
  }

}
