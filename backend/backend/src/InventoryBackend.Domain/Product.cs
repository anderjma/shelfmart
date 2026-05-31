using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryBackend.Domain.Entities;

[Table("Product")]
public class Product
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProductId { get; private set; }

    [Required]
    public Guid ProductResourceId { get; set; }

    [Column("Name")]
    [StringLength(100)]
    [Required]
    public required string Name { get; set; }

    [Required]
    public int Stock { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
}