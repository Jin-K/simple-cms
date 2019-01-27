using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleCMS.Data.Entities {

  public class Contact : IEntidad {

    [Key]
    public int Id { get; set; }

		public bool Active { get; set; } = true;

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public DateTime Created { get; set; } = DateTime.Now;

    public DateTime? Updated { get; set; }

    public char? Gender { get; set; }

    public string Language { get; set; }

    public string Title { get; set; }

    public DateTime? Birthday { get; set; }

    public string Description { get; set; }

    public string[] Phones { get; set; }

    public string[] Faxes { get; set; }

    public string[] Websites { get; set; }

    public string[] Emails { get; set; }

    public string Picture { get; set; }

    public string Skype { get; set; }

    public string Facebook { get; set; }

    public string Twitter { get; set; }

    public string LinkedIn { get; set; }

    [InverseProperty( "Contact" )]
    public ICollection<Address> Addresses { get; set; }
    
  }

}
