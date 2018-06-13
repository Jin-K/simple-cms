﻿using SimpleCRM.Api.Models;
using System.Collections.Generic;

namespace SimpleCRM.Api.Repositories {
  interface IDataEventRecordRepository {
    void Delete(long id);
    DataEventRecordDto Get(long id);
    IEnumerable<DataEventRecordDto> GetAll(string username);
    void Post(DataEventRecordDto dataEventRecord, string username);
    void Put(long id, DataEventRecordDto dataEventRecord);
    string GetUsername(long dataEventRecordId);
  }
}
