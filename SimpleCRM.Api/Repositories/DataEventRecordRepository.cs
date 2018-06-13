﻿using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SimpleCRM.Api.Data;
using SimpleCRM.Api.Models;

namespace SimpleCRM.Api.Repositories {
  public class DataEventRecordRepository : IDataEventRecordRepository {
    readonly DataEventRecordContext _context;
    readonly ILogger _logger;

    public DataEventRecordRepository(DataEventRecordContext context, ILoggerFactory loggerFactory, IDataProtectionProvider provider) {
      _context = context;
      _logger = loggerFactory.CreateLogger("IDataEventRecordResporitory");
    }

    public IEnumerable<DataEventRecordDto> GetAll(string username) {
      _logger.LogCritical("Getting a the existing records");
      return _context.DataEventRecords.Where(item => item.Username == username).Select(z =>
          new DataEventRecordDto {
            Name = z.Name,
            Description = z.Description,
            Timestamp = z.Timestamp,
            Id = z.Id
          });
    }

    public DataEventRecordDto Get(long id) {
      var dataEventRecord = _context.DataEventRecords.Select(z =>
          new DataEventRecordDto {
            Name = z.Name,
            Description = z.Description,
            Timestamp = z.Timestamp,
            Id = z.Id
          }).First(t => t.Id == id);
      return dataEventRecord;
    }


    public string GetUsername(long id) {
      var data = _context.DataEventRecords.First(t => t.Id == id);
      return data.Username;
    }

    [HttpPost]
    public void Post(DataEventRecordDto dataEventRecord, string username) {
      _context.DataEventRecords.Add(new DataEventRecord {
        Name = dataEventRecord.Name,
        Description = dataEventRecord.Description,
        Timestamp = DateTime.UtcNow,
        Id = dataEventRecord.Id,
        Username = username
      });
      _context.SaveChanges();
    }

    public void Put(long id, DataEventRecordDto dataEventRecordDto) {
      var dataEventRecord = _context.DataEventRecords.First(t => t.Id == id);
      dataEventRecord.Name = dataEventRecordDto.Name;
      dataEventRecord.Description = dataEventRecordDto.Description;
      dataEventRecord.Timestamp = DateTime.UtcNow;

      _context.DataEventRecords.Update(dataEventRecord);
      _context.SaveChanges();
    }

    public void Delete(long id) {
      var entity = _context.DataEventRecords.First(t => t.Id == id);
      _context.DataEventRecords.Remove(entity);
      _context.SaveChanges();
    }
  }
}
