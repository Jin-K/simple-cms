using System.ComponentModel.DataAnnotations;

namespace SimpleCMS.Data.Entities {
	public class NewsItemEntity {

		[Key]
		public long Id { get; set; }
		[Required]
		public string Author { get; set; }
		[Required]
		public string NewsGroup { get; set; }
		public string Header { get; set; }
		public string NewsText { get; set; }
	}
}
