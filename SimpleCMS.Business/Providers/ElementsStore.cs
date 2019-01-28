using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SimpleCMS.Business.Models;
using SimpleCMS.Data;
using SimpleCMS.Data.Entities;
using SimpleCMS.Data.Extensions;
using _Action = SimpleCMS.Data.Entities.Action;

namespace SimpleCMS.Business.Providers {

	/// <summary>
	/// The main ElementsStore class
	/// Provides methods to access entities database tables
	/// </summary>
	public class ElementsStore : IElementsStore {

		/// <summary>
		/// CmsContext's instance.
		/// 
		/// <seealso cref="ElementsStore" />
		/// </summary>
		private readonly CmsContext _cmsContext;

		/// <summary>
		/// TODELETE Fake db for entity items and user data
		/// </summary>
		/// <value></value>
		private readonly dynamic _fakeDB = new {
			Items = JsonConvert.DeserializeObject<List<dynamic>>("[{\"id\":\"5725a680b3249760ea21de52\",\"name\":\"Abbott\",\"lastName\":\"Keitch\",\"avatar\":\"assets/images/avatars/Abbott.jpg\",\"nickname\":\"Royalguard\",\"company\":\"Saois\",\"jobTitle\":\"Digital Archivist\",\"email\":\"abbott@withinpixels.com\",\"phone\":\"+1-202-555-0175\",\"address\":\"933 8th Street Stamford, CT 06902\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680606588342058356d\",\"name\":\"Arnold\",\"lastName\":\"Matlock\",\"avatar\":\"assets/images/avatars/Arnold.jpg\",\"nickname\":\"Wanderer\",\"company\":\"Laotcone\",\"jobTitle\":\"Graphic Artist\",\"email\":\"arnold@withinpixels.com\",\"phone\":\"+1-202-555-0141\",\"address\":\"906 Valley Road Michigan City, IN 46360\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a68009e20d0a9e9acf2a\",\"name\":\"Barrera\",\"lastName\":\"Bradbury\",\"avatar\":\"assets/images/avatars/Barrera.jpg\",\"nickname\":\"Jackal\",\"company\":\"Unizim\",\"jobTitle\":\"Graphic Designer\",\"email\":\"barrera@withinpixels.com\",\"phone\":\"+1-202-555-0196\",\"address\":\"183 River Street Passaic, NJ 07055\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a6809fdd915739187ed5\",\"name\":\"Blair\",\"lastName\":\"Strangeway\",\"avatar\":\"assets/images/avatars/Blair.jpg\",\"nickname\":\"Knight\",\"company\":\"Conedubdax\",\"jobTitle\":\"Visual Designer\",\"email\":\"blair@withinpixels.com\",\"phone\":\"+1-202-555-0118\",\"address\":\"143 Jones Street Eau Claire, WI 54701\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a68007920cf75051da64\",\"name\":\"Boyle\",\"lastName\":\"Winters\",\"avatar\":\"assets/images/avatars/Boyle.jpg\",\"nickname\":\"Jester\",\"company\":\"Newo\",\"jobTitle\":\"Catalogue Illustrator\",\"email\":\"boyle@withinpixels.com\",\"phone\":\"+1-202-555-0177\",\"address\":\"218 Pearl Street Brandon, FL 33510\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a68031fdbb1db2c1af47\",\"name\":\"Christy\",\"lastName\":\"Camacho\",\"avatar\":\"assets/images/avatars/Christy.jpg\",\"nickname\":\"Mist\",\"company\":\"uniway\",\"jobTitle\":\"3D Animator\",\"email\":\"christy@withinpixels.com\",\"phone\":\"+1-202-555-0136\",\"address\":\"329 Bridge Street Desoto, TX 75115\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680bc670af746c435e2\",\"name\":\"Copeland\",\"lastName\":\"Redcliff\",\"avatar\":\"assets/images/avatars/Copeland.jpg\",\"nickname\":\"Cloudlaw\",\"company\":\"Tempron\",\"jobTitle\":\"Multimedia Artist\",\"email\":\"copeland@withinpixels.com\",\"phone\":\"+1-202-555-0107\",\"address\":\"956 6th Avenue North Bergen, NJ 0704\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680e7eb988a58ddf303\",\"name\":\"Estes\",\"lastName\":\"Stevens\",\"avatar\":\"assets/images/avatars/Estes.jpg\",\"nickname\":\"Roamer\",\"company\":\"nam-dex\",\"jobTitle\":\"Special Effects Artist\",\"email\":\"estes@withinpixels.com\",\"phone\":\"+1-202-555-0113\",\"address\":\"664 York Street Cambridge, MA 02138\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680dcb077889f758961\",\"name\":\"Harper\",\"lastName\":\"MacGuffin\",\"avatar\":\"assets/images/avatars/Harper.jpg\",\"nickname\":\"Tempest\",\"company\":\"runcane\",\"jobTitle\":\"Application Developer\",\"email\":\"harper@withinpixels.com\",\"phone\":\"+1-202-555-0173\",\"address\":\"738 Route 11 Cornelius, NC 28031\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a6806acf030f9341e925\",\"name\":\"Helen\",\"lastName\":\"Sheridan\",\"avatar\":\"assets/images/avatars/Helen.jpg\",\"nickname\":\"Magicbattler\",\"company\":\"Subhow\",\"jobTitle\":\"Content Developer\",\"email\":\"helen@withinpixels.com\",\"phone\":\"+1-202-555-0163\",\"address\":\"194 Washington Avenue Saint Petersburg, FL 33702\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680ae1ae9a3c960d487\",\"name\":\"Henderson\",\"lastName\":\"Cambias\",\"avatar\":\"assets/images/avatars/Henderson.jpg\",\"nickname\":\"Blizzard\",\"company\":\"Howcom\",\"jobTitle\":\"Web Designer\",\"email\":\"henderson@withinpixels.com\",\"phone\":\"+1-202-555-0151\",\"address\":\"686 Roosevelt Avenue Oviedo, FL 32765\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680b8d240c011dd224b\",\"name\":\"Josefina\",\"lastName\":\"Lakefield\",\"avatar\":\"assets/images/avatars/Josefina.jpg\",\"nickname\":\"Violet\",\"company\":\"Gecko\",\"jobTitle\":\"Web Developer\",\"email\":\"josefina@withinpixels.com\",\"phone\":\"+1-202-555-0160\",\"address\":\"202 Hartford Road Lynchburg, VA 24502\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a68034cb3968e1f79eac\",\"name\":\"Katina\",\"lastName\":\"Bletchley\",\"avatar\":\"assets/images/avatars/Katina.jpg\",\"nickname\":\"Rose\",\"company\":\"Lexicom\",\"jobTitle\":\"Software Designer\",\"email\":\"katina@withinpixels.com\",\"phone\":\"+1-202-555-0186\",\"address\":\"219 Woodland Road Valrico, FL 33594\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a6801146cce777df2a08\",\"name\":\"Lily\",\"lastName\":\"Peasegood\",\"avatar\":\"assets/images/avatars/Lily.jpg\",\"nickname\":\"Star\",\"company\":\"zooflex\",\"jobTitle\":\"Software Specialist\",\"email\":\"lily@withinpixels.com\",\"phone\":\"+1-202-555-0115\",\"address\":\"305 Willow Drive Superior, WI 54880\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a6808a178bfd034d6ecf\",\"name\":\"Mai\",\"lastName\":\"Nox\",\"avatar\":\"assets/images/avatars/Mai.jpg\",\"nickname\":\"Violetmage\",\"company\":\"quadzone\",\"jobTitle\":\"Software Engineer\",\"email\":\"mai@withinpixels.com\",\"phone\":\"+1-202-555-0199\",\"address\":\"148 Heather Lane Mcminnville, TN 37110\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680653c265f5c79b5a9\",\"name\":\"Nancy\",\"lastName\":\"Jaggers\",\"avatar\":\"assets/images/avatars/Nancy.jpg\",\"nickname\":\"Silverwarden\",\"company\":\"Opetamnix\",\"jobTitle\":\"Software Architect\",\"email\":\"nancy@withinpixels.com\",\"phone\":\"+1-202-555-0120\",\"address\":\"345 Laurel Lane Union City, NJ 07087\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680bbcec3cc32a8488a\",\"name\":\"Nora\",\"lastName\":\"Franklin\",\"avatar\":\"assets/images/avatars/Nora.jpg\",\"nickname\":\"Katanachanter\",\"company\":\"Saoway\",\"jobTitle\":\"Database Coordinator\",\"email\":\"nora@withinpixels.com\",\"phone\":\"+1-202-555-0172\",\"address\":\"572 Rose Street Summerfield, FL 34491\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a6803d87f1b77e17b62b\",\"name\":\"Odessa\",\"lastName\":\"Goodman\",\"avatar\":\"assets/images/avatars/Odessa.jpg\",\"nickname\":\"Rose\",\"company\":\"transace\",\"jobTitle\":\"Database Administration Manager\",\"email\":\"odessa@withinpixels.com\",\"phone\":\"+1-202-555-0190\",\"address\":\"527 Jefferson Court Conyers, GA 30012\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680e87cb319bd9bd673\",\"name\":\"Reyna\",\"lastName\":\"Preece\",\"avatar\":\"assets/images/avatars/Reyna.jpg\",\"nickname\":\"Holydawn\",\"company\":\"Dingex\",\"jobTitle\":\"Data Processing Planner\",\"email\":\"reyna@withinpixels.com\",\"phone\":\"+1-202-555-0116\",\"address\":\"297 Strawberry Lane Faribault, MN 55021\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a6802d10e277a0f35775\",\"name\":\"Shauna\",\"lastName\":\"Atherton\",\"avatar\":\"assets/images/avatars/Shauna.jpg\",\"nickname\":\"Faunasoul\",\"company\":\"Vivaflex\",\"jobTitle\":\"Art Director\",\"email\":\"shauna@withinpixels.com\",\"phone\":\"+1-202-555-0159\",\"address\":\"928 Canterbury Court Pittsburgh, PA 15206\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680aef1e5cf26dd3d1f\",\"name\":\"Shepard\",\"lastName\":\"Rosco\",\"avatar\":\"assets/images/avatars/Shepard.jpg\",\"nickname\":\"Fireking\",\"company\":\"Goldenla\",\"jobTitle\":\"Magazine Designer\",\"email\":\"shepard@withinpixels.com\",\"phone\":\"+1-202-555-0173\",\"address\":\"904 Ridge Road Pickerington, OH 43147\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680cd7efa56a45aea5d\",\"name\":\"Tillman\",\"lastName\":\"Lee\",\"avatar\":\"assets/images/avatars/Tillman.jpg\",\"nickname\":\"Gust\",\"company\":\"K-techno\",\"jobTitle\":\"News Photographer\",\"email\":\"tillman@withinpixels.com\",\"phone\":\"+1-202-555-0183\",\"address\":\"447 Charles Street Dorchester, MA 02125\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a680fb65c91a82cb35e2\",\"name\":\"Trevino\",\"lastName\":\"Bush\",\"avatar\":\"assets/images/avatars/Trevino.jpg\",\"nickname\":\"Wolf\",\"company\":\"Dalthex\",\"jobTitle\":\"Photojournalist\",\"email\":\"trevino@withinpixels.com\",\"phone\":\"+1-202-555-0138\",\"address\":\"84 Valley View Road Norman, OK 73072\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a68018c663044be49cbf\",\"name\":\"Tyson\",\"lastName\":\"Marshall\",\"avatar\":\"assets/images/avatars/Tyson.jpg\",\"nickname\":\"Honordread\",\"company\":\"Geocon\",\"jobTitle\":\"Manuscript Editor\",\"email\":\"tyson@withinpixels.com\",\"phone\":\"+1-202-555-0146\",\"address\":\"204 Clark Street Monsey, NY 10952\",\"birthday\":\"\",\"notes\":\"\"},{\"id\":\"5725a6809413bf8a0a5272b1\",\"name\":\"Velazquez\",\"lastName\":\"Smethley\",\"avatar\":\"assets/images/avatars/Velazquez.jpg\",\"nickname\":\"Strifedream\",\"company\":\"ranex\",\"jobTitle\":\"Publications Editor\",\"email\":\"velezquez@withinpixels.com\",\"phone\":\"+1-202-555-0146\",\"address\":\"261 Cleveland Street Riverside, NJ 08075\",\"birthday\":\"\",\"notes\":\"\"}]"),
			UserData = JsonConvert.DeserializeObject<object>("{\"id\":\"5725a6802d10e277a0f35724\",\"name\":\"John Doe\",\"avatar\":\"assets/images/avatars/profile.jpg\",\"starred\":[1,3,4,7,11,16],\"frequentItems\":[\"5725a6809fdd915739187ed5\",\"5725a68031fdbb1db2c1af47\",\"5725a680606588342058356d\",\"5725a680e7eb988a58ddf303\",\"5725a6806acf030f9341e925\",\"5725a68034cb3968e1f79eac\",\"5725a6801146cce777df2a08\",\"5725a680653c265f5c79b5a9\"],\"groups\":[{\"id\":\"5725a6802d10e277a0f35739\",\"name\":\"Friends\",\"itemIds\":[\"5725a680bbcec3cc32a8488a\",\"5725a680e87cb319bd9bd673\",\"5725a6802d10e277a0f35775\"]},{\"id\":\"5725a6802d10e277a0f35749\",\"name\":\"Clients\",\"itemIds\":[\"5725a680cd7efa56a45aea5d\",\"5725a68018c663044be49cbf\",\"5725a6809413bf8a0a5272b1\",\"5725a6803d87f1b77e17b62b\"]},{\"id\":\"5725a6802d10e277a0f35329\",\"name\":\"Recent Workers\",\"itemIds\":[\"5725a680bbcec3cc32a8488a\",\"5725a680653c265f5c79b5a9\",\"5725a6808a178bfd034d6ecf\",\"5725a6801146cce777df2a08\"]}]}")
		};

		/// <summary>
		/// Constructor
		/// </summary>
		/// <remarks>
		/// Sets <see cref="_cmsContext" /> via DI
		/// </remarks>
		/// <param name="cmsContext">main database context of simple-cms</param>
		public ElementsStore(CmsContext cmsContext) => _cmsContext = cmsContext;

		/// <summary>
		/// Gets all main entities
		/// </summary>
		/// <returns>Returns all main entities as a generic list of <see cref="Entidad" /></returns>
		public async Task<IEnumerable<Entidad>> GetAllEntities()
		=> await _cmsContext.Entities.Select(e => new Entidad { Id = e.Id, Name = e.Name }).ToListAsync();

		/// <summary>
		/// Gets the primary key id of an entity
		/// </summary>
		/// <param name="entityName">name of the entity</param>
		/// <returns>Returns an integer id of the entity or -1 if not found</returns>
		public int GetEntityIdByName(string entityName)
	    => _cmsContext.Entities.FirstOrDefault(entity => entity.Name == entityName)?.Id ?? -1;

		/// <summary>
		/// Counts total of existing items for an given <paramref name="entity"/>
		/// </summary>
		/// <example>
		/// This example show how to call the <see cref="GetTotalItemsCount" /> method
		/// <code>
		/// int ExampleCountMethod(ElementsStore elementsStore, int case) {
		///   switch(case) {
		///     case 1: return elementsStore.GetTotalItemsCount("contacts");
		///     case 2: return elementsStore.GetTotalItemsCount("companies");
		///     case 3: return elementsStore.GetTotalItemsCount("actions");
		///     default: throw new ArgumentException( "only contacts, companies or actions for the moment" );
		///   }
		/// }
		/// </code>
		/// </example>
		/// <param name="entity">entity name</param>
		/// <returns>Returns the count</returns>
		public int GetTotalItemsCount(string entity)
		=> _cmsContext.AsQueryable<IEntidad>(entity).Count();

		/// <summary>
		/// Get all entity items filtered by <paramref name="queryParameters"/>
		/// </summary>
		/// <param name="entity">Entity name for items</param>
		/// <param name="orderBy">Column name for ordering</param>
		/// <param name="descending">True if ordered descending</param>
		/// <param name="page">Page number</param>
		/// <param name="pageCount">Items amount to take</param>
		/// <param name="totalCount">out parameter, returns total count of (filter or not) items</param>
		/// <param name="userId">User id (if negative, absolute value is id of current user)</param>
		/// <param name="listCategory">Category of items to show ( of type <see cref="EntityListCategory" /> )</param>
		/// <returns>Returns an ordered chunk of items as a generic <see cref="IEnumerable{T}" /> of <see cref="Item" /></returns>
		public IEnumerable<Item> GetFilteredAndOrderedItems(string entity, string orderBy, bool descending, uint page, uint pageCount, out int totalCount, int userId = 0, EntityListCategory listCategory = EntityListCategory.All) {

			// assert user id
			if (userId == 0) throw new System.ArgumentException("userId cannot be 0");

			// call special reflection method to get all items of desired table (one of CmsContext's DbSet<> properties)
			IQueryable<IEntidad> itemsSet = _cmsContext.AsQueryable<IEntidad>(entity);

			// get entityId
			var entityId = _cmsContext.Entities.SingleOrDefault(e => e.Name == entity)?.Id ?? 0;

			// if user id specified as filter
			if (userId > 0) {

				// TODO
				// itemsSet = 
				//   from usit in _cmsContext.UserItems
				//     join item in itemsSet on usit.ItemId equals item.Id into user_item
				//   from userItem in user_item
				//   where usit.EntityId == entityId
				//   select userItem;
			}
            else userId *= -1;

			IQueryable<int> favoriteIds;

			// if favorites category specified
			if (listCategory == EntityListCategory.Favorites) {

				// get only items listed in favorites table (for specific user)
				itemsSet =  from favo in _cmsContext.Favorites
                            join item in itemsSet on favo.ItemId equals item.Id into itemFavo
                            from favoriteItem in itemFavo
                            where favo.EntityId == entityId
                                && favo.UserId == userId
                            select favoriteItem;

				// select all filtered items for favorites
				favoriteIds = from item in itemsSet
							  select item.Id;

			}
            else {

				// query for favorites
				favoriteIds = from favo in _cmsContext.Favorites
							  join item in itemsSet on favo.ItemId equals item.Id into itemFavo
							  from favoriteItem in itemFavo
							  where favo.EntityId == entityId
								  && favo.UserId == userId
							  select favoriteItem.Id;
			}

			// get total count of entity items (filtered or not)
			totalCount = itemsSet.Count();

			// if not trying to order on column "active" (I think this column had an issue with ordering)
			if (!orderBy.StartsWith("active")) {

				// order by desired column, descending or not
				itemsSet = itemsSet.OrderBy(orderBy, descending);
			}

			// return all items starting from ordered query of IEntidad objects
			return itemsSet

			  // skip calculated amount depending on PageCount and Page
			  .Skip((int)pageCount * ((int)page - 1))

			  // take amount depending on PageCount
			  .Take((int)pageCount)

			  // cast IEntidad object to Item object
			  .Select(item => Item.FromEntidad(item, favoriteIds.Contains(item.Id)));

		}

		/// <summary>
		/// Gets an entity item depending on <paramref name="entityName" /> and <paramref name="id" />
		/// </summary>
		/// <param name="entityName">entity name for items</param>
		/// <param name="id">id of item</param>
		/// <param name="loadRelatedData">do we need to load related data ?</param>
		/// <returns>returns a raw <see cref="IEntidad" /> object</returns>
		public IEntidad GetItem(string entityName, int id, bool loadRelatedData = false) {

			// prepare query
			var query = $"select * from dbo.{entityName} where dbo.{entityName}.id = {id}";

			// get type of entity (deprecated: type result is not cached)
			var entityType = _cmsContext.GetEntityType(entityName);

			// get appropriate DbSet<TEntity> as IQueryable<TEntity>
			var set = _cmsContext.Query<IEntidad>(entityType);

			// filter on id (query)
			set = set.FromSql(query);

			// search for properties with "InversePropertyAttribute" in entity type ==> they are includable
			var allLoadablePropertyNames = entityType.AllLoadablePropertyNames();

			// iterate over entityType's properties and search for properties with "InversePropertyAttribute"
			foreach (var propertyName in allLoadablePropertyNames) {

				// include that property
				set = set.Include(propertyName);
			}

			// return item
			return set.FirstOrDefault();

		}

		/// <summary>
		/// Deletes an entity item depending on <paramref name="entityName" /> and <paramref name="id" />
		/// </summary>
		/// <param name="entityName">entity name for items</param>
		/// <param name="id">id of item</param>
		/// <returns>returns true if delete succeeded</returns>
		public bool DeleteItem(string entityName, int id) {

			var itemToDelete = (from i in _cmsContext.AsQueryable<IEntidad>(entityName) where i.Id == id select i).First();

			// TODO Use reflection ?
			switch (itemToDelete) {
            case Contact contactToDelete:
                _cmsContext.Contacts.Remove(contactToDelete);
                break;
            case Company companyToDelete:
                _cmsContext.Companies.Remove(companyToDelete);
                break;
            case _Action actionToDelete:
                _cmsContext.Actions.Remove(actionToDelete);
                break;
			}

			try {
				return _cmsContext.SaveChanges() == 1;
			}
            catch (DbUpdateConcurrencyException) {
				throw;
			}
            catch (DbUpdateException) {
				return false;
			}

		}

		/// <summary>
		/// Deletes a list of entity items depending on <paramref name="entityName" /> and <paramref name="ids" />
		/// </summary>
		/// <remarks>
		/// If delete fails due to foreign key constraints, it returns false and nothing is deleted
		/// </remarks>
		/// <param name="entityName">entity name for items</param>
		/// <param name="ids">array of ids</param>
		/// <returns>returns true if delete succeeded for all items</returns>
		public bool DeleteItems(string entityName, int[] ids) {

			var itemsToDelete = from i in _cmsContext.AsQueryable<IEntidad>(entityName) where ids.Contains(i.Id) select i;

			switch (entityName) {
				case "Contacts":
					_cmsContext.Contacts.RemoveRange(itemsToDelete.Cast<Contact>());
					break;
				case "Companies":
					_cmsContext.Companies.RemoveRange(itemsToDelete.Cast<Company>());
					break;
				case "Actions":
					_cmsContext.Actions.RemoveRange(itemsToDelete.Cast<_Action>());
					break;
			}

			try {
				return _cmsContext.SaveChanges() == ids.Length;
			}
            catch (DbUpdateConcurrencyException) {
				throw;
			}
            catch (DbUpdateException) {
				return false;
			}

		}

		/// <summary>
		/// TODELETE Gets items
		/// </summary>
		/// <returns>Returns a list of dynamic typed items</returns>
		public List<dynamic> GetItems()
		=> _fakeDB.Items;

		/// <summary>
		/// TODELETE Update or create item
		/// </summary>
		/// <param name="id">id of the item</param>
		/// <param name="item">item to add or replace</param>
		public void PostItem(string id, dynamic item) {

			// get list of items
			var items = _fakeDB.Items as List<dynamic>;

			// find position in array
			if (items == null) return;
			var index = items.FindIndex(o => o.id == id);

			// replace array or push
			if (index == -1) {

				// is new
				items.Add(item);
			}
            else {

				// replace
				items[index] = item;
			}
		}

		/// <summary>
		/// TODELETE Gets user data
		/// </summary>
		/// <returns>Returns user data</returns>
		public object GetUserData()
		=> _fakeDB.UserData;

		/// <summary>
		/// Gets a list of ids (max 100 ?) for a given <paramref name="entity" />, the opposite of the received <paramref name="inverseIds" />.
		/// Initial list can be differ depending on filters (<paramref name="userId" />, <paramref name="category" />)
		/// </summary>
		/// <param name="entity">entity name</param>
		/// <param name="userId">id of the user (can be negative)</param>
		/// <param name="category">category name (all or favorites)</param>
		/// <param name="inverseIds">inverse ids array of integers</param>
		/// <param name="limit">limit of id to return (default = 100)</param>
		/// <returns>Returns the list of normalized ids as enumerable</returns>
		public IEnumerable<int> GetInverseIdsForEntity(string entity, int userId, string category, IEnumerable<int> inverseIds, int limit = 100) {

			var inverseIdsSet = from item in _cmsContext.AsQueryable<IEntidad>(entity) where !inverseIds.Contains(item.Id) select item.Id;

			if (userId > 0) {

				// TODO
			}
            else userId *= -1;

			var entityId = _cmsContext.Entities.SingleOrDefault(e => e.Name == entity)?.Id ?? 0;

			// if favorites category specified
			if (category == "favorites") {

				// get only items listed in favorites table (for specific user)
				inverseIdsSet = from favo in _cmsContext.Favorites
                                join item in inverseIdsSet on favo.ItemId equals item into itemFavo
                                from favoriteItem in itemFavo
                                where favo.EntityId == entityId
                                    && favo.UserId == userId
                                select favoriteItem;
			}

			return inverseIdsSet.Take(limit);

		}

	}

	public enum EntityListCategory {
		All,
		Favorites
	}

}
