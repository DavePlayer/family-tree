using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace family_tree_API.Models;

public partial class FamilyTreeContext : DbContext
{
    public FamilyTreeContext()
    {
    }

    public FamilyTreeContext(DbContextOptions<FamilyTreeContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Connection> Connections { get; set; }

    public virtual DbSet<FamilyMember> FamilyMembers { get; set; }

    public virtual DbSet<FamilyTree> FamilyTrees { get; set; }

    public virtual DbSet<Node> Nodes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Connection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("connections_pkey");

            entity.ToTable("connections");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.FamilyTreeId).HasColumnName("family_tree_id");
            entity.Property(e => e.From).HasColumnName("from");
            entity.Property(e => e.To).HasColumnName("to");

            entity.HasOne(d => d.FamilyTree).WithMany(p => p.Connections)
                .HasForeignKey(d => d.FamilyTreeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tree");

            entity.HasOne(d => d.FromNavigation).WithMany(p => p.ConnectionFromNavigations)
                .HasForeignKey(d => d.From)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("from");

            entity.HasOne(d => d.ToNavigation).WithMany(p => p.ConnectionToNavigations)
                .HasForeignKey(d => d.To)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("to");
        });

        modelBuilder.Entity<FamilyMember>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("family_members_pkey");

            entity.ToTable("family_members");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.AdditionalData)
                .HasMaxLength(500)
                .HasColumnName("additional_data");
            entity.Property(e => e.BirthDate).HasColumnName("birth_date");
            entity.Property(e => e.DeathDate).HasColumnName("death_date");
            entity.Property(e => e.ImgUrl)
                .HasMaxLength(100)
                .HasColumnName("img_url");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Surname)
                .HasMaxLength(50)
                .HasColumnName("surname");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.FamilyMembers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user");
        });

        modelBuilder.Entity<FamilyTree>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("family_trees_pkey");

            entity.ToTable("family_trees");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.ImgUrl)
                .HasMaxLength(100)
                .HasColumnName("img_url");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.FamilyTrees)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("users");
        });

        modelBuilder.Entity<Node>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("nodes_pkey");

            entity.ToTable("nodes");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.FamilyMember).HasColumnName("family_member");
            entity.Property(e => e.FamilyTree).HasColumnName("family_tree");
            entity.Property(e => e.PosX).HasColumnName("pos_x");
            entity.Property(e => e.PosY).HasColumnName("pos_y");

            entity.HasOne(d => d.FamilyMemberNavigation).WithMany(p => p.Nodes)
                .HasForeignKey(d => d.FamilyMember)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("member");

            entity.HasOne(d => d.FamilyTreeNavigation).WithMany(p => p.Nodes)
                .HasForeignKey(d => d.FamilyTree)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tree");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.EMail)
                .HasMaxLength(40)
                .HasColumnName("e-mail");
            entity.Property(e => e.Name)
                .HasMaxLength(40)
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasMaxLength(40)
                .HasColumnName("password");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
