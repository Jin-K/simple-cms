using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Models {

  /// <summary>
  /// The main Entidad structure
  /// </summary>
  public struct Entidad {

    /// <summary>
    /// Id primary key
    /// </summary>
    /// <value>id of the entity</value>
    public int Id { get; set; }

    /// <summary>
    /// Entity Name
    /// </summary>
    /// <value>name of the entity</value>
    public string Name { get; set; }

  }

  /// <summary>
  /// The main Item structure
  /// </summary>
  public struct Item {

    /// <summary>
    /// Id primary key
    /// </summary>
    /// <value>id of the item</value>
    public int Id { get; set; }

    /// <summary>
    /// Active boolean
    /// </summary>
    /// <value>true if the item is active</value>
    public bool Active { get; set; }

    /// <summary>
    /// Created timestamp
    /// </summary>
    /// <value>item creation date and time</value>
    public System.DateTime Created { get; set; }

    /// <summary>
    /// Starred boolean.
    /// Depends on different table ('Favorites') that the item's entity table ('Contacts', 'Companies', 'Actions', ...)
    /// </summary>
    /// <value>true if the item is favorite</value>
    public bool Starred { get; set; }

    /// <summary>
    /// Static method to transforms a IEntity typed entity item to a Item typed strucure
    /// </summary>
    /// <param name="item">original entity item</param>
    /// <returns>returns the created Item</returns>
    public static Item FromEntidad(IEntity item, bool starred) => new Item { Id = item.Id, Active = true, Created = item.Created, Starred = starred };

  }

}
