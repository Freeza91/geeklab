# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( store.js )
Rails.application.config.assets.precompile += %w( store.css )
Rails.application.config.assets.precompile += %w( upload/mobile_upload.js )


Rails.application.config.assets.precompile += %w( dashboard.js)
Rails.application.config.assets.precompile += %w( dashboard.css )

Rails.application.config.assets.precompile += ['main-bundle.js',
                                               'sign-bundle.js',
                                               'assignment-index-bundle.js',
                                               'assignment-join-bundle.js',
                                               'project-index-bundle.js',
                                               'project-web-bundle.js',
                                               'project-app-bundle.js',
                                               'project-edit-bundle.js']
