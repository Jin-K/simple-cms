using System.Linq;

namespace SimpleCMS.Common.Extensions {

	/// <summary>
	/// Custom extensions for System.String.
	/// 
	/// <seealso cref="System.String" />
	/// </summary>
	public static class CustomExtensions {

		public static bool StartsWithOneOf(this string source, params string[] inputs)
			=> inputs.Any(input => source.StartsWith(input));

		/// <summary>
		/// Converts first char of any string ( <paramref name="str" /> ) to upperCase
		/// </summary>
		/// <param name="str">original string to convert</param>
		/// <returns>Returns result in a new string</returns>
		public static string ToUpperCaseFirst(this string str) {

			// return empty if empty or null
			if (string.IsNullOrEmpty( str )) return "";

			// convert to char array
			char[] a = str.ToCharArray();

			// first char to uppercase
			a[0] = char.ToUpper( a[0] );

			// return new string of char array
			return new string( a );
		}

	}

}
