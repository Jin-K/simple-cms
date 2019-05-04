using System;

namespace SimpleCMS.Data.Entities {

	/// <summary>
	/// IEntidad interface for entity-items (CMS entity-tables)
	/// </summary>
	public interface IEntidad {

		/// <summary>
		/// Unique primary key, indented
		/// </summary>
		/// <value>Id of item</value>
		int Id { get; set; }

		/// <summary>
		/// Field <see cref="Active" /> to indicate if item is active or not.
		/// Should be true as default
		/// </summary>
		/// <value>Item active state</value>
		bool Active { get; set; }

		/// <summary>
		/// Datetime of the moment this item was created.
		/// Should have a default value to help sql on inserts
		/// </summary>
		/// <value>Item creation datetime</value>
		DateTime Created { get; set; }

	}

}
