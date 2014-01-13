require 'drop/compiler'

namespace :layout do
  task :compile do
    Drop::Compiler.compile_layout
  end

  task :gzip do
    Drop::Compiler.gzip_layout
  end
end
