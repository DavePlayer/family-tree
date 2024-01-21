FROM mcr.microsoft.com/dotnet/sdk:7.0 as build
WORKDIR /src
COPY . .
RUN dotnet restore "family_tree_API.csproj"
RUN dotnet publish "family_tree_API.csproj" -c Release -o /publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 as final
WORKDIR /app
COPY --from=build /publish ./
RUN mkdir /app/assets

EXPOSE 5000

ENTRYPOINT ["dotnet", "family_tree_API.dll" ]

# docker build --rm -t family_tree:1 .
# docker run --rm -p 5000:5000 -p 5001:5001 -e ASPNETCORE_HTTP_PORT=https//+:5001 -e ASPNETCORE_URLS=http://+:5000 family_tree:1
