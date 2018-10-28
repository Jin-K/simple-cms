namespace SimpleCRM.Common.Extensions {
	public static class UtilExtensions {
    public static bool StartsWithOneOf(this string source, params string[] inputs) {
      foreach(var input in inputs) if (source.StartsWith(input)) return true;
      return false;
    }
	}
}