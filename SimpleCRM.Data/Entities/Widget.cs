using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;

namespace SimpleCRM.Data.Entities {


	public class Widget {
    const string LABELS = "[\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]";
    const string COLORS = "[{\"borderColor\":\"#42a5f5\",\"backgroundcolor\":\"#42a5f5\",\"pointBackgroundColor\":\"#1e88e5\",\"pointHoverBackgroundColor\":\"#1e88e5\",\"pointBorderColor\":\"#ffffff\",\"pointHoverBorderColor\":\"#ffffff\"}]";
    const string OPTIONS = "{\"spanGaps\":false,\"legend\":{\"display\":false},\"maintainAspectRatio\":false,\"layout\":{\"padding\":{\"top\":32,\"left\":32,\"right\":32}},\"elements\":{\"point\":{\"radius\":4,\"borderWidth\":2,\"hoverRadius\":4,\"hoverBorderWidth\":2},\"line\":{\"tension\":0}},\"scales\":{\"xAxes\":[{\"gridLines\":{\"display\":false,\"drawBorder\":true,\"tickMarkLength\":18},\"ticks\":{\"fontColor\":\"#ffffff\"}}],\"yAxes\":[{\"display\":false,\"ticks\":{\"min\":0,\"max\":100,\"stepSize\":0.5}}]},\"plugins\":{\"filler\":{\"propagate\":false},\"xLabelsOnTop\":{\"active\":true}},\"animation\":{\"duration\":0}}";

    [Key]
    public int Id { get; set; }

    [Required]
    public DateTime Created { get; set; } = System.DateTime.Now;

    [Required]
    public string ChartType {get; set;} = "line";

    [Required]
    public string _Labels { get; set; } = LABELS;

    [Required]
    public string _Colors { get; set; } = COLORS;

    [Required]
    public string _Options { get; set; } = OPTIONS;

    #region Properties that can not be mapped by EF
    [NotMapped]
    public string[] Labels { 
      get => _Labels == null ? null : JsonConvert.DeserializeObject<string[]>(_Labels);
      set => _Labels = JsonConvert.SerializeObject(value);
    }

    [NotMapped]
    public object[] Colors {
      get => _Colors == null ? null : JsonConvert.DeserializeObject<object[]>(_Colors);
      set => _Colors = JsonConvert.SerializeObject(value);
    }

    [NotMapped]
    public object Options {
      get => _Options == null ? null : JsonConvert.DeserializeObject<object>(_Options);
      set => _Options = JsonConvert.SerializeObject(value);
    }
    #endregion
	}
}
