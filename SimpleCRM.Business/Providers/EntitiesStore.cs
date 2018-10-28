using Microsoft.EntityFrameworkCore;
using SimpleCRM.Business.Models;
using SimpleCRM.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

using SimpleCRM.Business.Extensions;

using _Action = SimpleCRM.Data.Entities.Action;
using SimpleCRM.Data;

namespace SimpleCRM.Business.Providers {
  public class EntitiesStore {

    readonly CrmContext _entitiesContext;

    public EntitiesStore(CrmContext entitiesContext) {
      _entitiesContext = entitiesContext;
    }

    public async Task<IEnumerable<Entidad>> GetAllEntities() => 
      await _entitiesContext.Entities
        .Select( e => new Entidad { Id = e.Id, Name = e.Name } )
        .ToListAsync();
    public int Count(string entity) => 
    _entitiesContext.AsGenericQueryableSet<object>(entity.UppercaseFirst()).Count();

    public IEnumerable<Item> GetAll(QueryParameters queryParameters) {
      string entity = queryParameters.Query;

      // IQueryable<IEntidad> _allItems = GetSetAsQueryable(entity);
      IQueryable<IEntidad> _allItems = _entitiesContext.AsGenericQueryableSet<IEntidad>(entity);

      if (!queryParameters.OrderBy.StartsWith("active")) _allItems = _allItems.OrderBy( queryParameters.OrderBy, queryParameters.Descending ); ;

      return _allItems
        .Skip( queryParameters.PageCount * ( queryParameters.Page - 1 ) )
        .Take( queryParameters.PageCount )
        .Select( Item.FromEntidad );
    }

    public Item GetItem(GetItemParameters getItemParameters) => Item.FromEntidad(_entitiesContext
      .FindById<IEntidad>( getItemParameters.Id, getItemParameters.Entity.UppercaseFirst()));
  }
}
