global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Mvc;
global using BackEnd_BlogDemo.Blog.BusinessLayer.DTOs;
global using BackEnd_BlogDemo.Blog.BusinessLayer.DTOs.Posts;
global using BackEnd_BlogDemo.Blog.BusinessLayer.Service.Interface;
global using BackEnd_BlogDemo.Blog.BusinessLayer.DTOs.Comment;
global using BackEnd_BlogDemo.Blog.BusinessLayer.DTOs.Auth;
global using BackEnd_BlogDemo.Blog.BusinessLayer.DTOs.User;
global using BackEnd_BlogDemo.Blog.BusinessLayer.Mapper;
global using BackEnd_BlogDemo.Blog.BusinessLayer.Service;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.IdentityModel.Tokens;
global using Microsoft.OpenApi.Models;
global using Swashbuckle.AspNetCore.Filters;
global using BackEnd_BlogDemo.Blog.DataAccessLayer.Database;

namespace BackEnd_BlogDemo.Blog.ApiLayer
{
    public class GlobalUsing
    {
        
    }
}