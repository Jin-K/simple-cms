using System.ComponentModel.DataAnnotations;

namespace SimpleCMS.Data.Entities {
	public class NewsGroup {
		[Key]
		public long Id { get; set; }
		[Required]
		public string Name { get; set; }
	}
}
