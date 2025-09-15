terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.10"

  backend "s3" {
    bucket                      = "terraform"
    key                         = "infra/terraform.tfstate"
    region                      = "auto"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

######
# Cloudflare Pages
######
resource "cloudflare_pages_project" "main" {
  account_id        = var.cloudflare_account_id
  name              = "ininicho"
  production_branch = "main"

  lifecycle {
    ignore_changes = all
  }
}

# Issue with Pages Custom Domain
# resource "cloudflare_pages_domain" "main" {
#   account_id   = var.cloudflare_account_id
#   project_name = "ininicho"
#   name         = "ininicho.com"
# }
# 
# resource "cloudflare_pages_domain" "main_www" {
#   account_id   = var.cloudflare_account_id
#   project_name = "ininicho"
#   name         = "www.ininicho.com"
# }

######
# R2 Buckets
######
resource "cloudflare_r2_bucket" "public" {
  account_id = var.cloudflare_account_id
  name       = "public"
}

resource "cloudflare_r2_custom_domain" "public" {
  enabled     = true
  account_id  = var.cloudflare_account_id
  bucket_name = cloudflare_r2_bucket.public.name
  domain      = "public.ininicho.com"
  zone_id     = var.cloudflare_zone_id
}
