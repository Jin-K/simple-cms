using System;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace SimpleCMS.Data.Config {

	/// <summary>
	/// The main StringConversionConfigBase class
	/// </summary>
	/// <inheritdoc />
	public class StringConversionConfigBase : WithDefaultSqlNowBaseConfig {

		/// <summary>
		/// The main constructor, calls parent constructor
		/// </summary>
		/// <param name="isSqlServer"></param>
		/// <inheritdoc />
		protected StringConversionConfigBase(bool isSqlServer) : base(isSqlServer) { }

		/// <summary>
		/// Constant string delimiter for array of string during ef core conversion
		/// <para>&#160;</para>
		/// <seealso cref="AosToSConverter" />
		/// </summary>
		private const string AosDelimiter = "d;^_°;b";

		/// <summary>
		/// Array of string to string converter
		/// </summary>
		/// <remarks>
		/// Is used by EF core >=2.1 method: <see cref="PropertyBuilder{TProperty}.HasConversion{TProvider}(ValueConverter{TProperty,TProvider})" />
		/// </remarks>
		/// <typeparam>c# array of string type property</typeparam>
		/// <typeparam>sql raw string type provider</typeparam>
		/// <value>Value of the converter</value>
		protected readonly ValueConverter<string[], string> AosToSConverter = new ValueConverter<string[], string>(
			expect => string.Join( AosDelimiter, expect ),
			cope => cope.Split( AosDelimiter, StringSplitOptions.RemoveEmptyEntries )
		);

	}

}
