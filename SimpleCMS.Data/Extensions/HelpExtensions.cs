using System;
using System.Globalization;

namespace SimpleCMS.Data.Extensions {

	internal static class HelpExtensions {

        private static readonly CultureInfo FrBeCulture = new CultureInfo( 2060 ); // fr-BE

        internal static DateTime ToDateTime(this string stringDate) => DateTime.Parse( stringDate, FrBeCulture );
        
	}
}
