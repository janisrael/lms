<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="app-token" content="{{ $appToken ?? "" }}">
        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
        <script src="{{ asset('js/app.js').'?d='.time() }}" defer></script>
        <script>
            let APP_TOKEN = '{{ $appToken ?? "" }}';
        </script>
        <script src="https://player.vimeo.com/api/player.js"></script>
        {{--  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">  --}}
        <link rel="dns-prefetch" href="//fonts.gstatic.com">

       
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
        <!-- Styles -->
        <style>
          
        </style>

        <style>
            html, body {
                /*background-color: #fff;*/
                /*color: #636b6f;*/
                font-family: sans-serif;
                font-weight: 200;
                height: 100vh;
                margin: 0;
            }
    
            .full-height {
                height: 100vh;
            }
    
            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }
    
            .position-ref {
                position: relative;
            }
    
            .top-right {
                position: absolute;
                right: 10px;
                top: 18px;
            }
    
            .content {
                text-align: center;
            }
    
            .title {
                font-size: 84px;
            }
        </style>
  
    </head>
    <body>
        <div id="app">
            <index-component></index-component>
        </div>
        <script>
            window.ENV = {
                APP_URL: '{{ config('app.url') }}',
                APP_DEBUG: '{{ config('app.debug') }}',
                PASSPORT_TOKEN: '{{ config('app.passport_token') }}',
            };
        </script>
    </body>
</html>
