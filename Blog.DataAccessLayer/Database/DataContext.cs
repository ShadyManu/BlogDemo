namespace BackEnd_BlogDemo.Blog.DataAccessLayer.Database
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }


        // Crea le entità utilizzando l'approccio CodeFirst con OnModelCreating
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Model Builder per l'entità User
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique(true);
            modelBuilder.Entity<User>().Property(u => u.Username).IsRequired(true);
            modelBuilder.Entity<User>().Property(u => u.PasswordHash).IsRequired(true);
            modelBuilder.Entity<User>().Property(u => u.PasswordSalt).IsRequired(true);
            modelBuilder.Entity<User>().Property(u => u.AuthorName).IsRequired(true);

            // Model Builder per l'entità Post
            modelBuilder.Entity<Post>().HasKey(u => u.Id);
            modelBuilder.Entity<Post>().HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<Post>().Property(p => p.Title).IsRequired(true);
            modelBuilder.Entity<Post>().Property(p => p.Body).IsRequired(true);

            // Model Builder per l'entità Comment
            modelBuilder.Entity<Comment>().HasKey(c => c.Id);
            modelBuilder.Entity<Comment>().HasOne(c => c.Post).WithMany(p => p.Comments).HasForeignKey(c => c.PostId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Comment>().HasOne(c => c.User).WithMany().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<Comment>().Property(c => c.Body).IsRequired(true);

        }
    }
}