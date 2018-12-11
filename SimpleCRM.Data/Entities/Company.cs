using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleCRM.Data.Entities {
  public class Company : IEntidad {

    const string DELIMITER = "d;^_°;b";

    [Key]
    public int Id { get; set; }

    public string Name { get; set; }

    [Required]
    public DateTime Created { get; set; } = DateTime.Now;

    public DateTime? Updated { get; set; }

    public string Description { get; set; }

    string _phones;
    [NotMapped]
    public string[] Phones {
      get => _phones.Split(DELIMITER, StringSplitOptions.RemoveEmptyEntries);
      set => _phones = string.Join($"{DELIMITER}", value);
    }

    string _faxes;
    [NotMapped]
    public string[] Faxes {
      get => _faxes.Split(DELIMITER, StringSplitOptions.RemoveEmptyEntries);
      set => _faxes = string.Join($"{DELIMITER}", value);
    }

    string _websites;
    [NotMapped]
    public string[] Websites {
      get => _websites.Split(DELIMITER, StringSplitOptions.RemoveEmptyEntries);
      set => _websites = string.Join($"{DELIMITER}", value);
    }

    string _emails;
    [NotMapped]
    public string[] Emails {
      get => _emails.Split(DELIMITER, StringSplitOptions.RemoveEmptyEntries);
      set => _emails = string.Join($"{DELIMITER}", value);
    }

    public string Picture { get; set; }

    public string Facebook { get; set; }

    public string Twitter { get; set; }

    [InverseProperty( "Company" )]
    public ICollection<Address> Addresses { get; set; }
  }
}
