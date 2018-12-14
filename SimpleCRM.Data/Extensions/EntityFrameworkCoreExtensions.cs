using System;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Internal;

namespace Microsoft.EntityFrameworkCore {

  /// <summary>
  /// Custom extensions for EF Core.
  /// 
  /// <seealso cref="Microsoft.EntityFrameworkCore" />
  /// </summary>
  /// <remarks>
  /// Copied/pasted part of this <see href="https://stackoverflow.com/a/48042166">answer</see>
  /// </remarks>
	public static partial class CustomExtensions {

    /// <summary>
    /// MethodInfo of non-generic DbContext.Set method
    /// </summary>
		static readonly MethodInfo SetMethod = typeof(DbContext).GetMethod(nameof(DbContext.Set));

    /// <summary>
    /// Gets entity's property in DbContext using reflection
    /// </summary>
    /// <param name="context">Source DbContext where we should look</param>
    /// <param name="entityType">The entity type of the generic DbSet</param>
    /// <returns>Returns a non-generic IQueryable of the set</returns>
		public static IQueryable<T> Query<T>(this DbContext context, Type entityType)
    => (IQueryable<T>)SetMethod.MakeGenericMethod(entityType).Invoke(context, null);

    /// <summary>
    /// Seeks CLR type for an entity in DbContext and gets corresponding property
    /// </summary>
    /// <param name="context">Source DbContext where we should look</param>
    /// <param name="entityName">The name of the entity type to find.</param>
    /// <returns>Returns a non-generic IQueryable of the set</returns>
		public static IQueryable Query2(this DbContext context, string entityName)
    => context.Query3(context.Model.FindEntityType(entityName).ClrType);

    /// <summary>
    /// Gets entity's property in DbContext using hidden API interface and methods
    /// </summary>
    /// <param name="context">Source DbContext where we should look</param>
    /// <param name="entityType">The entity type of the generic DbSet</param>
    /// <returns>Returns a non-generic IQueryable of the set</returns>
		public static IQueryable Query3(this DbContext context, Type entityType)
    => (IQueryable)((IDbSetCache)context).GetOrAddSet(context.GetDependencies().SetSource, entityType);

    /// <summary>
    /// Finds the inner generic type of a property ( <paramref name="entityName" /> ) in a given <paramref name="context" />
    /// </summary>
    /// <param name="context">Source DbContext where we should look</param>
    /// <param name="entityName">The name of the entity type to find</param>
    /// <returns>Returns an entity type</returns>
    [Obsolete("Searching type with reflection, but is not reusing results !", false)]
    public static Type GetEntityType(this DbContext context, string entityName)
    => context.GetType().GetProperty(entityName, BindingFlags.Public | BindingFlags.Instance)
              .PropertyType.GenericTypeArguments.FirstOrDefault();

    /// <summary>
    /// Just finds an entity set ( <see cref="DbSet{TEntity}" /> ) and gets it as generic IQueryable
    /// </summary>
    /// <typeparam name="TEntity">Type of result item (entity type)</typeparam>
    /// <param name="context">Source DbContext where we should look</param>
    /// <param name="entityName">Entity name / table name</param>
    /// <returns></returns>
    public static IQueryable<TEntity> AsQueryable<TEntity>(this DbContext context, string entityName)
    => context.GetType().GetProperty( entityName, BindingFlags.Public | BindingFlags.Instance ).GetValue( context, null ) as IQueryable<TEntity>;

    /// <summary>
    /// Gives an array of all properties with attribute "InverseProperty" in the entity type
    /// </summary>
    /// <param name="entityType"></param>
    /// <returns>Returns an array of strings (simple name of found properties)</returns>
    [Obsolete("Searching properties with reflection, but is not reusing results !", false)]
    public static string[] AllLoadablePropertyNames(this Type entityType) {

      // prepare list
      var propertiesFound = new System.Collections.Generic.List<string>();

      // for each public and 'instance type' property in that entity type
      foreach(var propertyInfo in entityType.GetProperties(BindingFlags.Public | BindingFlags.Instance)) {

        // try to get "InverseProperty" attribute
        var inversePropertyAttribute = propertyInfo.GetCustomAttribute(typeof(System.ComponentModel.DataAnnotations.Schema.InversePropertyAttribute));

        // add to properties list if attribute exists
        if (inversePropertyAttribute != null) propertiesFound.Add( propertyInfo.Name );
      }

      // return list
      return propertiesFound.ToArray();

    }

	}

}
