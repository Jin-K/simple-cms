﻿using Microsoft.EntityFrameworkCore;
using SimpleCRM.Api.Models;

namespace SimpleCRM.Api.Data {
  public class DataEventRecordContext : DbContext {
    public DataEventRecordContext(DbContextOptions<DataEventRecordContext> options) : base(options) { }

    public DbSet<DataEventRecord> DataEventRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder builder) {
      builder.Entity<DataEventRecord>().HasKey(m => m.Id);
      base.OnModelCreating(builder);
    }
  }
}
